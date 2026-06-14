// 找到 HTML 中 id 为 themeButton 的按钮。
const themeButton = document.querySelector("#themeButton");
// 找到显示名字的 span。
const displayName = document.querySelector("#displayName");
// 找到输入名字的输入框。
const nameInput = document.querySelector("#nameInput");
// 找到保存名字的按钮。
const saveNameButton = document.querySelector("#saveNameButton");
// 找到提示信息所在的段落。
const nameMessage = document.querySelector("#nameMessage");

// 当用户点击按钮时，执行里面的代码。
themeButton.addEventListener("click", () => {
  // toggle 会自动切换 dark class：没有就添加，有就移除。
  document.body.classList.toggle("dark");
});

// 当用户点击“保存名字”按钮时，读取输入框内容并更新页面。
saveNameButton.addEventListener("click", () => {
  // value 表示输入框里的文字，trim 会去掉前后的空格。
  const newName = nameInput.value.trim();

  // 如果用户没有输入内容，就给出提示，并提前结束函数。
  if (newName === "") {
    nameMessage.textContent = "请先输入一个名字。";
    return;
  }

  // textContent 可以修改标签里显示的文字。
  displayName.textContent = newName;
  nameMessage.textContent = `名字已更新为：${newName}`;
  nameInput.value = "";
});
