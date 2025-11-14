import axios from "axios";
import dotenv from 'dotenv'

import express from 'express'
dotenv.config()
//console.log(process.env.URL);

// polling after every one minute
let latestData: any[] = [];
const polling = async () => {
    try {
        const res = await axios.get(process.env.URL || "")
        if (res.data) {
            //console.log(res.data.S04.chartData);
            latestData=[]
            latestData = res.data.S04.chartData;
            //console.log(latestData);
            //console.log(latestData)

        }
        else {
            console.log("down");

        }
    } catch (error) {
        console.log(error);

    }
}

// fxing cold start issue
setInterval(() => {
    polling()
}, 30000)

const app = express()
app.get("/", (req, res) => {
    const html = `
    <html>
      <head>
       <meta http-equiv="refresh" content="2">
        <title>Live Election Results Bihar Assembly</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f0f2f5;
            padding: 40px;
            text-align: center;
          }
          h1 {
            color: #333;
          }
          .card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            min-width: 350px;
          }
          .item {
            font-size: 20px;
            margin: 8px 0;
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .party {
            font-weight: bold;
            color: #2c3e50;
          }
          .votes {
            color: #16a085;
          }
        </style>
      </head>
      <body>

        <h1>Live Election Status (S04)</h1>

       <div class="card">
  ${latestData.length > 0
            ? latestData.map(item => {
                return `
            <div class="item" style="border-left: 10px solid ${item[4]};">
              <div class="party">${item[0]}</div>
              <div class="candidate">${item[3]}</div>
              <div class="seat">Seat: ${item[1]}</div>
              <div class="serial">Serial: ${item[2]}</div>
            </div>
          `;
            }).join("")
            : "<p>No data available</p>"
        }
</div>



        <p style="color:#888; margin-top:15px;">
          Updated automatically every 2 seconds
        </p>

      </body>
    </html>
  `;
        
        
    res.send(html);
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});


