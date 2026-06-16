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
// 找到兴趣数量显示区域。
const interestCount = document.querySelector("#interestCount");
// 找到搜索兴趣的输入框。
const searchInput = document.querySelector("#searchInput");
// 找到新增兴趣的输入框。
const interestInput = document.querySelector("#interestInput");
// 找到新增兴趣的按钮。
const addInterestButton = document.querySelector("#addInterestButton");
// 找到重置兴趣的按钮。
const resetInterestsButton = document.querySelector("#resetInterestsButton");
// 找到清空兴趣的按钮。
const clearInterestsButton = document.querySelector("#clearInterestsButton");
// 找到取消编辑的按钮。
const cancelEditButton = document.querySelector("#cancelEditButton");
// 找到兴趣区域的提示信息。
const interestMessage = document.querySelector("#interestMessage");
// 找到信息卡片容器。
const infoGrid = document.querySelector("#infoGrid");
// 找到新增卡片的标题输入框。
const cardTitleInput = document.querySelector("#cardTitleInput");
// 找到标题字数提示。
const cardTitleCounter = document.querySelector("#cardTitleCounter");
// 找到新增卡片的正文输入框。
const cardTextInput = document.querySelector("#cardTextInput");
// 找到正文剩余字数提示。
const cardTextCounter = document.querySelector("#cardTextCounter");
// 找到新增卡片的等级选择框。
const cardLevelInput = document.querySelector("#cardLevelInput");
// 找到新增卡片按钮。
const addCardButton = document.querySelector("#addCardButton");
// 找到重置卡片按钮。
const resetCardsButton = document.querySelector("#resetCardsButton");
// 找到卡片区域提示信息。
const cardMessage = document.querySelector("#cardMessage");

// localStorage 只能保存字符串，所以我们用一个固定 key 找到兴趣数据。
const interestsStorageKey = "day01-interests";
// 信息卡片也需要一个独立 key，避免和兴趣数据混在一起。
const infoCardsStorageKey = "day01-info-cards";
// 学习卡片标题最长允许 12 个字符。
const cardTitleMaxLength = 12;
// 学习卡片正文最长允许 60 个字符。
const cardTextMaxLength = 60;
// 对象适合保存一组有关联的信息，比如一张卡片的标题和正文。
const defaultInfoCards = [
  {
    title: "今天学习",
    text: "HTML 负责网页结构，CSS 负责样式，JavaScript 负责交互。",
    level: "基础",
    completed: true,
  },
  {
    title: "近期目标",
    text: "先做出简单页面，再逐步学习 React、后端、数据库和部署。",
    level: "计划",
    completed: false,
  },
];
// 默认兴趣用于第一次打开页面，或者本地没有保存数据时。
const defaultInterests = ["Vibe coding", "弹吉他", "健身"];
// 用对象数组保存卡片数据，页面显示什么由它决定。
let infoCards = loadInfoCards();
// 用数组保存兴趣数据。let 允许我们后面把它替换成本地读取到的数据。
let interests = loadInterests();
// null 表示当前没有在编辑；数字表示正在编辑的兴趣下标。
let editingInterestIndex = null;

// 从浏览器本地读取兴趣数组。
function loadInterests() {
  const savedInterests = localStorage.getItem(interestsStorageKey);

  // 如果本地没有保存过数据，就使用默认兴趣。
  if (savedInterests === null) {
    return [...defaultInterests];
  }

  try {
    // JSON.parse 可以把 JSON 字符串还原成 JavaScript 数组。
    return JSON.parse(savedInterests);
  } catch {
    // 如果保存的数据坏掉了，就回到默认兴趣，避免页面打不开。
    return [...defaultInterests];
  }
}

// 从浏览器本地读取信息卡片对象数组。
function loadInfoCards() {
  const savedInfoCards = localStorage.getItem(infoCardsStorageKey);

  if (savedInfoCards === null) {
    return [...defaultInfoCards];
  }

  try {
    return JSON.parse(savedInfoCards);
  } catch {
    return [...defaultInfoCards];
  }
}

// 把当前兴趣数组保存到浏览器本地。
function saveInterests() {
  // JSON.stringify 可以把数组转换成 localStorage 能保存的字符串。
  localStorage.setItem(interestsStorageKey, JSON.stringify(interests));
}

// 把当前信息卡片对象数组保存到浏览器本地。
function saveInfoCards() {
  localStorage.setItem(infoCardsStorageKey, JSON.stringify(infoCards));
}

// 统一更新提示信息，type 用来控制提示颜色。
function showMessage(element, text, type = "info") {
  element.textContent = text;
  element.className = `message ${type}`;
}

// 根据是否处于编辑状态，更新按钮文字和取消按钮显示。
function updateInterestEditorMode() {
  if (editingInterestIndex === null) {
    addInterestButton.textContent = "添加兴趣";
    cancelEditButton.classList.add("hidden");
    return;
  }

  addInterestButton.textContent = "保存修改";
  cancelEditButton.classList.remove("hidden");
}

// 根据 infoCards 对象数组，生成页面上的信息卡片。
function renderInfoCards() {
  infoGrid.innerHTML = "";

  if (infoCards.length === 0) {
    const emptyCard = document.createElement("article");

    emptyCard.textContent = "暂无学习卡片，请添加一张。";
    emptyCard.className = "empty-card";
    infoGrid.append(emptyCard);
    return;
  }

  infoCards.forEach((card, index) => {
    const article = document.createElement("article");
    const cardHeader = document.createElement("div");
    const cardTitleGroup = document.createElement("div");
    const title = document.createElement("h2");
    const level = document.createElement("span");
    const status = document.createElement("span");
    const toggleButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const text = document.createElement("p");

    // 通过对象的属性名读取数据。
    title.textContent = card.title;
    level.textContent = card.level;
    level.className = `level-badge level-${card.level}`;
    status.textContent = card.completed ? "已完成" : "未完成";
    status.className = card.completed ? "status-badge completed" : "status-badge pending";
    toggleButton.textContent = card.completed ? "取消完成" : "标记完成";
    toggleButton.type = "button";
    toggleButton.className = "toggle-card";
    toggleButton.dataset.index = index;
    deleteButton.textContent = "删除";
    deleteButton.type = "button";
    deleteButton.className = "delete-card";
    deleteButton.dataset.index = index;
    text.textContent = card.text;

    cardTitleGroup.className = "card-title-group";
    cardTitleGroup.append(title, level, status);
    cardHeader.className = "card-header";
    cardHeader.append(cardTitleGroup, toggleButton, deleteButton);
    article.append(cardHeader, text);
    infoGrid.append(article);
  });
}

// 通用字数提示函数，可以同时服务标题和正文。
function updateCounter(inputElement, counterElement, maxLength, warningLimit, prefix = "还可以输入") {
  const remainingCount = maxLength - inputElement.value.length;

  counterElement.textContent = `${prefix} ${remainingCount} 个字`;
  counterElement.classList.toggle("warning", remainingCount <= warningLimit);
}

// 更新学习卡片标题的剩余字数提示。
function updateCardTitleCounter() {
  updateCounter(cardTitleInput, cardTitleCounter, cardTitleMaxLength, 2);
}

// 更新学习卡片正文的剩余字数提示。
function updateCardTextCounter() {
  updateCounter(cardTextInput, cardTextCounter, cardTextMaxLength, 5, "正文还可以输入");
}

// 根据表单内容创建一个新卡片对象，并添加到 infoCards 数组。
function addInfoCard() {
  const title = cardTitleInput.value.trim();
  const text = cardTextInput.value.trim();
  const level = cardLevelInput.value;

  if (title === "" || text === "") {
    showMessage(cardMessage, "请填写卡片标题和正文。", "error");
    return;
  }

  if (text.length > cardTextMaxLength) {
    showMessage(cardMessage, `卡片正文不能超过 ${cardTextMaxLength} 个字。`, "error");
    return;
  }

  if (title.length > cardTitleMaxLength) {
    showMessage(cardMessage, `卡片标题不能超过 ${cardTitleMaxLength} 个字。`, "error");
    return;
  }

  // 新卡片是一个对象，对象里保存这张卡片需要的多个字段。
  const newCard = {
    title,
    text,
    level,
    completed: false,
  };

  infoCards.push(newCard);
  saveInfoCards();
  renderInfoCards();
  showMessage(cardMessage, `已添加卡片：${title}`, "success");
  cardTitleInput.value = "";
  cardTextInput.value = "";
  updateCardTitleCounter();
  updateCardTextCounter();
}

// 恢复默认学习卡片。
function resetInfoCards() {
  const shouldReset = confirm("确定要重置学习卡片吗？");

  if (!shouldReset) {
    showMessage(cardMessage, "已取消重置卡片。", "info");
    return;
  }

  // 复制默认对象数组，避免直接共用 defaultInfoCards。
  infoCards = defaultInfoCards.map((card) => {
    return { ...card };
  });
  saveInfoCards();
  renderInfoCards();
  showMessage(cardMessage, "学习卡片已恢复默认。", "success");
}

// 根据 interests 数组和搜索关键词，重新生成页面上的兴趣列表。
function renderInterests() {
  const searchKeyword = searchInput.value.trim().toLowerCase();
  // filter 会返回一个新数组，不会修改原始 interests。
  const visibleInterests = interests
    .map((interest, index) => {
      return { interest, index };
    })
    .filter((item) => {
      return item.interest.toLowerCase().includes(searchKeyword);
    });

  // 先清空列表，避免重复渲染出多份 li。
  interestList.innerHTML = "";
  // length 表示数组里有多少项。
  interestCount.textContent =
    searchKeyword === "" ? `${interests.length} 项` : `${visibleInterests.length}/${interests.length} 项`;

  // 如果数组为空，就显示一个空状态提示。
  if (interests.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.textContent = "暂无兴趣，请添加一个。";
    emptyItem.className = "empty-item";
    interestList.append(emptyItem);
    return;
  }

  // 如果有数据但搜索结果为空，就显示“没有匹配结果”。
  if (visibleInterests.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.textContent = "没有匹配的兴趣。";
    emptyItem.className = "empty-item";
    interestList.append(emptyItem);
    return;
  }

  // forEach 会遍历数组里的每一项。
  visibleInterests.forEach((item) => {
    const listItem = document.createElement("li");
    const interestText = document.createElement("span");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    interestText.textContent = item.interest;
    editButton.textContent = "编辑";
    editButton.type = "button";
    editButton.className = "edit-interest";
    editButton.dataset.index = item.index;
    deleteButton.textContent = "删除";
    deleteButton.type = "button";
    deleteButton.className = "delete-interest";
    // dataset 可以把数据藏在 HTML 元素上，这里保存它在数组里的位置。
    deleteButton.dataset.index = item.index;

    listItem.append(interestText, editButton, deleteButton);
    interestList.append(listItem);
  });
}

// 当用户点击按钮时，执行里面的代码。
themeButton.addEventListener("click", () => {
  // toggle 会自动切换 dark class：没有就添加，有就移除。
  document.body.classList.toggle("dark");
});

// 保存名字的具体逻辑，按钮点击和回车提交都会调用它。
function saveName() {
  // value 表示输入框里的文字，trim 会去掉前后的空格。
  const newName = nameInput.value.trim();

  // 如果用户没有输入内容，就给出提示，并提前结束函数。
  if (newName === "") {
    showMessage(nameMessage, "请先输入一个名字。", "error");
    return;
  }

  // textContent 可以修改标签里显示的文字。
  displayName.textContent = newName;
  showMessage(nameMessage, `名字已更新为：${newName}`, "success");
  nameInput.value = "";
}

// 添加或更新兴趣的具体逻辑，按钮点击和回车提交都会调用它。
function saveInterest() {
  const newInterest = interestInput.value.trim();

  if (newInterest === "") {
    showMessage(interestMessage, "请先输入一个兴趣。", "error");
    return;
  }

  // some 会检查数组中是否至少有一项满足条件。
  const isDuplicate = interests.some((interest, index) => {
    // 编辑时要跳过自己，否则原名字也会被当成重复。
    if (index === editingInterestIndex) {
      return false;
    }

    return interest.toLowerCase() === newInterest.toLowerCase();
  });

  // 如果兴趣已经存在，就提示用户，并停止新增。
  if (isDuplicate) {
    showMessage(interestMessage, `“${newInterest}”已经在兴趣列表里了。`, "error");
    return;
  }

  if (editingInterestIndex !== null) {
    const oldInterest = interests[editingInterestIndex];

    interests[editingInterestIndex] = newInterest;
    editingInterestIndex = null;
    saveInterests();
    renderInterests();
    updateInterestEditorMode();
    showMessage(interestMessage, `已将“${oldInterest}”修改为“${newInterest}”`, "success");
    interestInput.value = "";
    return;
  }

  // push 会把新内容添加到数组末尾。
  interests.push(newInterest);
  saveInterests();
  renderInterests();
  showMessage(interestMessage, `已添加兴趣：${newInterest}`, "success");
  interestInput.value = "";
}

// 当用户点击“保存名字”按钮时，读取输入框内容并更新页面。
saveNameButton.addEventListener("click", () => {
  saveName();
});

// 当用户在名字输入框按下 Enter 时，也保存名字。
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveName();
  }
});

// 点击按钮时，新增一张信息卡片。
addCardButton.addEventListener("click", () => {
  addInfoCard();
});

// 输入标题时，实时更新剩余字数。
cardTitleInput.addEventListener("input", () => {
  updateCardTitleCounter();
});

// 输入正文时，实时更新剩余字数。
cardTextInput.addEventListener("input", () => {
  updateCardTextCounter();
});

// 点击按钮时，恢复默认学习卡片。
resetCardsButton.addEventListener("click", () => {
  resetInfoCards();
});

// 在卡片正文输入框里按 Enter，也新增卡片。
cardTextInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addInfoCard();
  }
});

// 事件委托：统一处理信息卡片里的按钮点击。
infoGrid.addEventListener("click", (event) => {
  const clickedElement = event.target;

  const cardIndex = Number(clickedElement.dataset.index);

  if (clickedElement.classList.contains("toggle-card")) {
    infoCards[cardIndex].completed = !infoCards[cardIndex].completed;
    saveInfoCards();
    renderInfoCards();
    showMessage(cardMessage, `已更新“${infoCards[cardIndex].title}”的完成状态。`, "success");
    return;
  }

  if (!clickedElement.classList.contains("delete-card")) {
    return;
  }

  const cardTitle = infoCards[cardIndex].title;
  const shouldDelete = confirm(`确定要删除“${cardTitle}”吗？`);

  if (!shouldDelete) {
    showMessage(cardMessage, "已取消删除卡片。", "info");
    return;
  }

  infoCards.splice(cardIndex, 1);
  saveInfoCards();
  renderInfoCards();
  showMessage(cardMessage, `已删除卡片：${cardTitle}`, "success");
});

// 当用户点击“添加兴趣”按钮时，先更新数组，再重新渲染列表。
addInterestButton.addEventListener("click", () => {
  saveInterest();
});

// 当用户在兴趣输入框按下 Enter 时，也添加兴趣。
interestInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveInterest();
  }
});

// 输入搜索关键词时，实时重新渲染可见列表。
searchInput.addEventListener("input", () => {
  renderInterests();
});

// 事件委托：把点击监听放在 ul 上，统一处理所有删除按钮。
interestList.addEventListener("click", (event) => {
  // event.target 表示用户实际点击到的元素。
  const clickedElement = event.target;

  if (clickedElement.classList.contains("edit-interest")) {
    editingInterestIndex = Number(clickedElement.dataset.index);
    interestInput.value = interests[editingInterestIndex];
    interestInput.focus();
    updateInterestEditorMode();
    showMessage(interestMessage, "正在编辑兴趣，修改后点击“保存修改”。", "info");
    return;
  }

  if (clickedElement.classList.contains("delete-interest")) {
    // Number 会把字符串形式的下标转成数字。
    const interestIndex = Number(clickedElement.dataset.index);
    const interestText = interests[interestIndex];

    // splice 会从数组里删除指定位置的数据。
    interests.splice(interestIndex, 1);
    editingInterestIndex = null;
    saveInterests();
    renderInterests();
    updateInterestEditorMode();
    showMessage(interestMessage, `已删除兴趣：${interestText}`, "success");
  }
});

// 取消编辑时，清空输入框并恢复为新增模式。
cancelEditButton.addEventListener("click", () => {
  editingInterestIndex = null;
  interestInput.value = "";
  updateInterestEditorMode();
  showMessage(interestMessage, "已取消编辑。", "info");
});

// 当用户点击“重置兴趣”按钮时，恢复默认兴趣。
resetInterestsButton.addEventListener("click", () => {
  // confirm 会弹出确认框，用户点击“取消”时返回 false。
  const shouldReset = confirm("确定要重置兴趣列表吗？");

  if (!shouldReset) {
    showMessage(interestMessage, "已取消重置。", "info");
    return;
  }

  // 复制默认数组，避免直接共用 defaultInterests 这个原始数组。
  interests = [...defaultInterests];
  editingInterestIndex = null;
  saveInterests();
  renderInterests();
  updateInterestEditorMode();
  showMessage(interestMessage, "兴趣列表已恢复默认。", "success");
});

// 当用户点击“清空兴趣”按钮时，删除所有兴趣。
clearInterestsButton.addEventListener("click", () => {
  if (interests.length === 0) {
    showMessage(interestMessage, "当前没有可以清空的兴趣。", "info");
    return;
  }

  const shouldClear = confirm("确定要清空全部兴趣吗？");

  if (!shouldClear) {
    showMessage(interestMessage, "已取消清空。", "info");
    return;
  }

  // 清空数据源，并保存空数组。
  interests = [];
  editingInterestIndex = null;
  interestInput.value = "";
  saveInterests();
  renderInterests();
  updateInterestEditorMode();
  showMessage(interestMessage, "全部兴趣已清空。", "success");
});

// 页面刚打开时，先把默认兴趣渲染出来。
renderInfoCards();
renderInterests();
updateInterestEditorMode();
updateCardTitleCounter();
updateCardTextCounter();
