padWithZero = function (val) {
    return (val < 10) ? ("0" + val) : val;
};

exports.getDate = function () {
    let date = new Date();
    let day = padWithZero(date.getDate());
    let month = padWithZero(date.getMonth() + 1);
    let year = date.getFullYear();
    return day + '-' + month + '-' + year;
};

exports.getTime = function () {
    let time = new Date();
    let hour = padWithZero(time.getHours());
    let min = padWithZero(time.getMinutes());
    let sec = padWithZero(time.getSeconds());
    return hour + ':' + min + ':' + sec;
};

exports.constructBarcode = function () {
    let dt = new Date();
    let day = padWithZero(dt.getDate());
    let month = padWithZero(dt.getMonth() + 1);
    let year = dt.getFullYear().toString().slice(2);
    let hour = padWithZero(dt.getHours());
    let min = padWithZero(dt.getMinutes());
    let sec = padWithZero(dt.getSeconds());
    return day.toString() + month.toString() + year + hour.toString() + min.toString() + sec.toString();
};