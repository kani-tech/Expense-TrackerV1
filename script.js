'use strict'



const transferButton = document.querySelector(".form__btn--transfer")

transferButton.addEventListener("click", function () {
    fetch('http://localhost:3000/')
        .then(response => response.json())
        .then(data => console.log(data))
    /*function fetchData() {
        fetch('http://localhost:3000/').then(data => console.log(data))
    }
    fetchData();*/
})

/*
const myButton = document.querySelector(".BUTTON")

transferButton.addEventListener("click", function () {
    function fetchData() {
        fetch('http://localhost:3000/').
    }
    fetchData();
})*/