//jshint esversion 6
'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//let movementsSection = document.querySelector('.movements')
mongoose.connect("mongodb://localhost:27017/expenseDB", { useNewUrlParser: true, useUnifiedTopology: true })


// Schema
const expenseSchema = {
    amount: Number,
    reason: String,
    type: String,
    date: String,
}

const expense = mongoose.model("Expense", expenseSchema)

const testSchema = new expense({
    amount: 100,
    reason: "Food",
    type: "Withdrawal",
    date: "Today"
})
const expenseArr = [testSchema];
let switcher = true;

function getCurrentDate() {
    let fullDate = new Date()
    let day = `${fullDate.getDate()}/${fullDate.getMonth() + 1}/${fullDate.getFullYear()}`;

    return day;
}
// GET REQUEST TO RENDER

app.get("/", function (req, res) {
    expense.find({}, function (err, foundItems) {
        let total = calcBalance(foundItems);
        console.log(switcher)
        console.log(calcWithdrawals(foundItems))
        res.render("tracker", { transactions: foundItems, balance: total, checker: switcher, deposits: calcDeposits(foundItems), withdrawals: calcWithdrawals(foundItems) });
    });
});


// POST REQUEST TO STORE DATA

// Expense
app.post("/expense", function (req, res) {
    let expenseAmount = req.body.expenseAmount;
    let expenseType = req.body.expenseType;

    const currentExpense = new expense({
        amount: expenseAmount,
        reason: expenseType,
        type: "Withdrawal", // placeholder
        date: getCurrentDate() // placeholder
    })

    currentExpense.save();

    res.redirect('/');
})

// Income
app.post("/income", function (req, res) {
    let income = req.body.income;

    const currentExpense = new expense({
        amount: income,
        reason: "empty",
        type: "Deposit", // placeholder
        date: getCurrentDate()  // placeholder
    })

    currentExpense.save();

    res.redirect('/');
})


function calcBalance(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type === "Withdrawal") {
            if (total - items[i].amount < 0) {
                expense.deleteOne({ _id: items[i]._id }, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("success")
                    }
                })
                switcher = false;
            } else {
                total -= items[i].amount
                switcher = true;
            }
        } else {
            total += items[i].amount
            switcher = true;
        }
    }
    return total;
}

function calcDeposits(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type === "Deposit") {
            total += items[i].amount;
        }
    }
    return total;
}

function calcWithdrawals(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type === "Withdrawal") {
            total += items[i].amount;
        }
    }
    return total;
}



app.listen(3000, function () {
    console.log('connection complete')
})


