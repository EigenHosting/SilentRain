import "dotenv/config";
const adminID = ["915989266943860746", "208256080092856321"];
const header = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.KAIL_SUPERKEY}`,
  },
};

export { adminID, header };
