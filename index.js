$(document).ready(() => {
    $(".thumb-up-pre").hover((event) => {
        event.currentTarget.textContent = "👍";
    }, (event) => {
        event.currentTarget.textContent = "👍🏻";
    });

    $(".thumb-down-pre").hover((event) => {
        event.currentTarget.textContent = "👎";
    }, (event) => {
        event.currentTarget.textContent = "👎🏻";
    });
});