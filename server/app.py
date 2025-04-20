from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import numpy as np

from portfolio_analytics.classes.market_data import MarketData
from portfolio_analytics.classes.portfolio_decomposer import PortfolioDecomposer
from portfolio_analytics.classes.portfolio_calculations import PortfolioCalculations

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Paths to DB and metadata
DB_PATH = os.path.abspath("portfolio_analytics/data/stocks_1yr.db")
META_PATH = os.path.abspath("portfolio_analytics/data/etf_metadata.json")

# Initialize market data
market_data = MarketData(db_name=DB_PATH, meta_file=META_PATH)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        df = pd.read_csv(filepath) if file.filename.endswith(".csv") else pd.read_excel(filepath)
        #print("File read into DataFrame")

        # 1. Raw portfolio HTML
        raw_portfolio = df.copy()
        keep_cols = ["Symbol", "Description", "PositionValue", "AssetClass", "SubCategory"]
        raw_portfolio = ( raw_portfolio.loc[:, keep_cols].copy() )     # keep only the requested columns and make a copy
        raw_portfolio["Portfolio Weight pct"] = (raw_portfolio.PositionValue * 100 / raw_portfolio.PositionValue.sum()).round(2)
        raw_portfolio = raw_portfolio.sort_values(by="Portfolio Weight pct", ascending=False).reset_index(drop=True)
        

        raw_portfolio_clean=raw_portfolio.copy()
        raw_portfolio_clean = raw_portfolio_clean.rename(columns={
            "Symbol": "Ticker",
            "Description": "Security Name",
            "PositionValue": "Position Value ($)",
            "AssetClass": "Asset Class",
            "SubCategory": "Sub-Category",
            "Portfolio Weight pct": "Portfolio Weight (%)"
        })

        raw_portfolio_clean.index += 1
        raw_portfolio_html = raw_portfolio_clean.to_html(classes="table w-full text-sm text-left text-gray-500",
                                                   index=True,
                                                   border=0).replace("<th", "<th class='text-left'")
        #print(raw_portfolio)  

        # 2. Portfolio decomposition
        port_decomposer = PortfolioDecomposer(port=raw_portfolio, market_data=market_data)
        stocks_df = port_decomposer.decompose_stocks()
        sectors_df = port_decomposer.decompose_sectors()
        #print(stocks_df)
        #print(sectors_df)
        stocks_df_clean = stocks_df.copy()
        sectors_df_clean = sectors_df.copy()

        # Rename columns safely
        stocks_df_clean = stocks_df_clean.rename(columns={
            "ticker": "Ticker",
            "name": "Security Name",
            "allocation": "Position Value ($)",
            "port_weight_pct": "Portfolio Weight (%)"
        })

        sectors_df_clean = sectors_df_clean.rename(columns={
            "gics_sector": "GICS Sector",
            "allocation": "Position Value ($)",
            "port_weight_pct": "Portfolio Weight (%)"
        })

        if stocks_df_clean.empty and sectors_df_clean.empty:
            return jsonify({"error": "No valid stocks or sectors found in your portfolio."}), 200

        stocks_df_clean.index += 1
        sectors_df_clean.index += 1

        stocks_html = stocks_df_clean.to_html(classes="table w-full text-sm text-left text-gray-500",
                                                   index=True,
                                                   border=0).replace("<th", "<th class='text-left'")
        sectors_html = sectors_df_clean.to_html(classes="table w-full text-sm text-left text-gray-500",
                                                   index=True,
                                                   border=0).replace("<th", "<th class='text-left'")

        #print(stocks_df.head())
        #print(sectors_df)

        # 3. Active Weights
        port_calc = PortfolioCalculations()

        port_stocks_sectors = port_decomposer.decompose_stock_and_sectors()
        port_stocks_sectors['weight'] = port_stocks_sectors['allocation'] / port_stocks_sectors['allocation'].sum()

        etf_holdings_dict = market_data.get_etf_holdings()
        if "SPY" not in etf_holdings_dict:
            return jsonify({"error": "SPY benchmark data is missing from ETF holdings."}), 500

        benchmark_holdings = etf_holdings_dict["SPY"]
        if benchmark_holdings.empty:
            return jsonify({"error": "SPY benchmark holdings are empty."}), 500

        benchmark_holdings['PositionValue'] = benchmark_holdings['weight'] * 100
        benchmark_decomposer = PortfolioDecomposer(benchmark_holdings, market_data)
        benchmark_stocks_sectors = benchmark_decomposer.decompose_stock_and_sectors()
        benchmark_stocks_sectors['weight'] = benchmark_stocks_sectors['allocation'] / benchmark_stocks_sectors['allocation'].sum()

        port_sector_weights = port_stocks_sectors.groupby("gics_sector")["weight"].sum().reset_index()
        benchmark_sector_weights = benchmark_stocks_sectors.groupby("gics_sector")["weight"].sum().reset_index()

        active_weights_df = pd.merge(
            port_sector_weights,
            benchmark_sector_weights,
            on="gics_sector",
            how="outer",
            suffixes=("_portfolio", "_benchmark"),
            validate="one_to_one"
        ).fillna(0)

        active_weights_df["active_weight"] = (
            active_weights_df["weight_portfolio"] - active_weights_df["weight_benchmark"]
        )
        active_weights_df[["weight_portfolio", "weight_benchmark", "active_weight"]] = (
            active_weights_df[["weight_portfolio", "weight_benchmark", "active_weight"]] * 100
        ).round(2)

        active_weights_clean = active_weights_df.copy()

        # Rename columns
        active_weights_clean = active_weights_clean.rename(columns={
            "gics_sector": "GICS Sector",
            "weight_portfolio": "Portfolio Weight (%)",
            "weight_benchmark": "Benchmark Weight (%)",
            "active_weight": "Active Weight (%)"
        })

        active_weights_clean.index+=1

        active_weights_html = active_weights_clean.to_html(classes="table w-full text-sm text-left text-gray-500",
                                                   index=True,
                                                   border=0).replace("<th", "<th class='text-left'")
        #print(active_weights_df)

        # 4. Attribution
        tickers = stocks_df["ticker"].dropna().unique().tolist()
        if not tickers:
            return jsonify({"error": "No valid tickers found for attribution analysis."}), 200
        #print(tickers)
        price_data = market_data.get_stock_prices_data(tickers)
        #print(price_data.head(20))
        #if not price_data:
        #    return jsonify({"error": "No stock price data available for selected tickers."}), 500
        price_df = port_calc.reshape_stock_prices(price_data, metric="close")
        #print(price_df.head(20))
        returns_daily = port_calc.calculate_returns(price_df)
        #returns_daily = (price_df / price_df.shift(1) -1)
        #print(returns_daily.head())
        returns_monthly = port_calc.aggregate_returns(returns_daily, "monthly").reset_index()
        #returns_monthly= returns_daily.resample('M').apply(lambda x: np.prod(1 + x) - 1)
        #print(returns_monthly.head())

        #print(returns_daily.head())
        #print(returns_monthly)

        port_sector_weights_time, port_sector_returns = port_calc.aggregate_portfolio_by_sector(
            returns_monthly, port_stocks_sectors
        )
        #print(port_sector_weights_time.head(20))
        benchmark_sector_weights_time, benchmark_sector_returns = port_calc.aggregate_portfolio_by_sector(
            returns_monthly, benchmark_stocks_sectors
        )

        attribution_df = port_calc.brinson_hood_beebower(
            port_sector_weights_time,
            port_sector_returns,
            benchmark_sector_weights_time,
            benchmark_sector_returns
        )
        # --- ROUND last 3 columns to 2 decimal places ---
        attribution_df[["allocation_effect", "selection_effect", "total_active_return"]] = (
        attribution_df[["allocation_effect", "selection_effect", "total_active_return"]] * 100
        ).round(2)

        # --- Sort by date descending ---
        attribution_df = attribution_df.sort_values(by="date", ascending=False).reset_index(drop=True)

        attribution_df_clean=attribution_df.copy()

        # Rename columns
        attribution_df_clean = attribution_df_clean.rename(columns={
            "date": "Date",
            "allocation_effect": "Allocation Effect (%)",
            "selection_effect": "Selection Effect (%)",
            "total_active_return": "Total Active Return (%)"
        })

        attribution_html = attribution_df_clean.to_html(classes="table w-full text-sm text-left text-gray-500",
                                                   index=False,
                                                   border=0).replace("<th", "<th class='text-left'")

        return jsonify({
            "raw_portfolio": raw_portfolio_html,
            "stocks": stocks_html,
            "sectors": sectors_html,
            "active_weights": active_weights_html,
            "attribution": attribution_html
        })

    except Exception as e:
        return jsonify({"error": f"Server encountered an error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
