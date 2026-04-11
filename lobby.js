let o = document.querySelector("#o")
let p = document.querySelector(".p")
let open = document.querySelector("#open");
let close = document.querySelector("#close")
 open.onclick = function(){
  const us = o.value

p.innerHTML = "hello "+us + "!"
p.style.fontSize= "50px"
p.style.color= "red"

}
 close.onclick = function(){
p.innerHTML = ""

}