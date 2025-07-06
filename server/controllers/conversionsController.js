const db = require('../db');

exports.getAllConversions = async (req ,res) => {
    try {
        const conversions = db.prepare('SELECT * FROM conversions ORDER BY timestamp DESC').all();
        res.json(conversions);
    } catch (error) {
        res.status(500).json({error:"server error"});
    }
}

exports.saveConversion = async(req,res) => {
    try {
        const {amount , targetCurrency , result , timestamp} = req.body;
        const insert = db.prepare(
            'INSERT INFO conversions (amount ,targetCurrency,result,timestamp) VALUES (?,?,?,?)'
        );

        const info = insert.run(amount,targetCurrency,result,timestamp);
        res.json(201).json({
            id:info.lastInsertRowid,
            amount,
            targetCurrency,
            result,
            timestamp
        });
    } catch (error) {
        
    }
};