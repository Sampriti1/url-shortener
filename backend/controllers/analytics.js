const URL = require('../model/url');

async function handleGetUserAnalytics(req, res) {
    try {
        const userId = req.user._id;

        
        const allUrls = await URL.find({ createdBy: userId });

        if (!allUrls || allUrls.length === 0) {
            return res.json({
                totalLinks: 0,
                totalClicks: 0,
                topLinks: [],
                clicksPerDay: []
            });
        }

        
        const totalLinks = allUrls.length;
        const totalClicks = allUrls.reduce((acc, url) => acc + url.visitHistory.length, 0);


        const topLinks = allUrls
            .sort((a, b) => b.visitHistory.length - a.visitHistory.length)
            .slice(0, 5)
            .map(url => ({
                shortId: url.shortId,
                redirectURL: url.redirectURL,
                clicks: url.visitHistory.length
            }));

   
        const clicksPerDay = {};
        allUrls.forEach(url => {
            url.visitHistory.forEach(visit => {
                const date = new Date(visit.timestamp).toISOString().split('T')[0]; // Format as YYYY-MM-DD
                if (!clicksPerDay[date]) {
                    clicksPerDay[date] = 0;
                }
                clicksPerDay[date]++;
            });
        });

      
        const chartData = Object.keys(clicksPerDay)
            .sort() 
            .map(date => ({
                name: date,
                clicks: clicksPerDay[date]
            }));

       
        return res.json({
            totalLinks,
            totalClicks,
            topLinks,
            clicksPerDay: chartData
        });

    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Server error while fetching analytics." });
    }
}

module.exports = {
    handleGetUserAnalytics,
};