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

// localStorage 只能保存字符串，所以我们用一个固定 key 找到兴趣数据。
const interestsStorageKey = "day01-interests";
// 默认兴趣用于第一次打开页面，或者本地没有保存数据时。
const defaultInterests = ["Vibe coding", "弹吉他", "健身"];
// 用数组保存兴趣数据。let 允许我们后面把它替换成本地读取到的数据。
let interests = loadInterests();

// 从浏览器本地读取兴趣数组。
function loadInterests() {
  const savedInterests = localStorage.getItem(interestsStorageKey);

  // 如果本地没有保存过数据，就使用默认兴趣。
  if (savedInterests === null) {
    return defaultInterests;
  }

  try {
    // JSON.parse 可以把 JSON 字符串还原成 JavaScript 数组。
    return JSON.parse(savedInterests);
  } catch {
    // 如果保存的数据坏掉了，就回到默认兴趣，避免页面打不开。
    return defaultInterests;
  }
}

// 把当前兴趣数组保存到浏览器本地。
function saveInterests() {
  // JSON.stringify 可以把数组转换成 localStorage 能保存的字符串。
  localStorage.setItem(interestsStorageKey, JSON.stringify(interests));
}

// 根据 interests 数组重新生成页面上的兴趣列表。
function renderInterests() {
  // 先清空列表，避免重复渲染出多份 li。
  interestList.innerHTML = "";

  // forEach 会遍历数组里的每一项。
  interests.forEach((interest, index) => {
    const listItem = document.createElement("li");
    const interestText = document.createElement("span");
    const deleteButton = document.createElement("button");

    interestText.textContent = interest;
    deleteButton.textContent = "删除";
    deleteButton.type = "button";
    deleteButton.className = "delete-interest";
    // dataset 可以把数据藏在 HTML 元素上，这里保存它在数组里的位置。
    deleteButton.dataset.index = index;

    listItem.append(interestText, deleteButton);
    interestList.append(listItem);
  });
}

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

// 当用户点击“添加兴趣”按钮时，先更新数组，再重新渲染列表。
addInterestButton.addEventListener("click", () => {
  const newInterest = interestInput.value.trim();

  if (newInterest === "") {
    interestMessage.textContent = "请先输入一个兴趣。";
    return;
  }

  // push 会把新内容添加到数组末尾。
  interests.push(newInterest);
  saveInterests();
  renderInterests();
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

  // Number 会把字符串形式的下标转成数字。
  const interestIndex = Number(clickedElement.dataset.index);
  const interestText = interests[interestIndex];

  // splice 会从数组里删除指定位置的数据。
  interests.splice(interestIndex, 1);
  saveInterests();
  renderInterests();
  interestMessage.textContent = `已删除兴趣：${interestText}`;
});

// 页面刚打开时，先把默认兴趣渲染出来。
renderInterests();
