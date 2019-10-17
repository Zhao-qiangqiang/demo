function changeNumber(){
    let data = ['A','B','C','D','E','F','j','h','i','j','p','A','B','C','D','E'];
    let num1 = data[Math.round(Math.random() * 10)];
    let num2 = data[Math.round(Math.random() * 10)];
    let num3 = data[Math.round(Math.random() * 10)];
    let num4 = data[Math.round(Math.random() * 10)];

    lists.innerHTML = num1 + num2 + num3 + num4;
}
changeNumber()

function sure(){
    var value = document.querySelector("#value").value;

    if (value.toLowerCase() == lists.innerHTML.toLowerCase()){
        alert('验证码输入正确')
    }else{
        alert('验证码校验不通过')
    }
}       