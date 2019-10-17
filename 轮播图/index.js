function move() {
  return (a = setInterval(function() {
    index++;
    if (index == current.length) {
      index = 0;
    }
    changePic();
  }, 1500));
}
move();
function dotClick(time) {
  index = time;
  dubble();
}
function changePic() {
  for (let i = 0; i < current.length; i++) {
    if (i == index) {
      current[index].style.display = "block";
      dot[index].style.backgroundColor = "green";
    } else {
      current[i].style.display = "none";
      dot[i].style.backgroundColor = "yellow";
    }
  }
}
function dubble() {
  changePic();
  clearInterval(a);
  setTimeout(function() {
    move();
  }, 2000);
}
function arrowClick(value) {
  switch (value) {
    case "left":
      index--;
      if (index < 0) {
        index = 3;
      }
      break;
    case "right":
      index++;
      if (index > 3) {
        index = 0;
      }
      break;
    default:
      break;
  }
  dubble();
}
