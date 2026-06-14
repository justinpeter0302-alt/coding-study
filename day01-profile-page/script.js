// 找到 HTML 中 id 为 themeButton 的按钮。
const themeButton = document.querySelector("#themeButton");

// 当用户点击按钮时，执行里面的代码。
themeButton.addEventListener("click", () => {
  // toggle 会自动切换 dark class：没有就添加，有就移除。
  document.body.classList.toggle("dark");
});
