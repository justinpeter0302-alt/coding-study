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
// 找到兴趣列表。
const interestList = document.querySelector("#interestList");
// 找到新增兴趣的输入框。
const interestInput = document.querySelector("#interestInput");
// 找到新增兴趣的按钮。
const addInterestButton = document.querySelector("#addInterestButton");
// 找到兴趣区域的提示信息。
const interestMessage = document.querySelector("#interestMessage");

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

// 当用户点击“添加兴趣”按钮时，创建一个新的列表项。
addInterestButton.addEventListener("click", () => {
  const newInterest = interestInput.value.trim();

  if (newInterest === "") {
    interestMessage.textContent = "请先输入一个兴趣。";
    return;
  }

  // createElement 可以创建一个新的 HTML 元素。
  const listItem = document.createElement("li");
  const interestText = document.createElement("span");
  const deleteButton = document.createElement("button");

  // 给新元素设置文字和属性。
  interestText.textContent = newInterest;
  deleteButton.textContent = "删除";
  deleteButton.type = "button";
  deleteButton.className = "delete-interest";

  // append 可以把子元素放进父元素里。
  listItem.append(interestText, deleteButton);
  interestList.append(listItem);

  interestMessage.textContent = `已添加兴趣：${newInterest}`;
  interestInput.value = "";
});

// 事件委托：把点击监听放在 ul 上，统一处理所有删除按钮。
interestList.addEventListener("click", (event) => {
  // event.target 表示用户实际点击到的元素。
  const clickedElement = event.target;

  // 如果点击的不是删除按钮，就不继续执行。
  if (!clickedElement.classList.contains("delete-interest")) {
    return;
  }

  // closest("li") 会向上找到离按钮最近的 li。
  const listItem = clickedElement.closest("li");
  const interestText = listItem.querySelector("span").textContent;

  listItem.remove();
  interestMessage.textContent = `已删除兴趣：${interestText}`;
});
