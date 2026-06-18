// ===== DOM 元素 =====

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
// 找到兴趣置顶筛选框。
const interestPinnedFilter = document.querySelector("#interestPinnedFilter");
// 找到兴趣颜色筛选框。
const interestColorFilter = document.querySelector("#interestColorFilter");
// 找到兴趣筛选说明。
const interestFilterSummary = document.querySelector("#interestFilterSummary");
// 找到清空兴趣筛选按钮。
const clearInterestFiltersButton = document.querySelector("#clearInterestFiltersButton");
// 找到新增兴趣的输入框。
const interestInput = document.querySelector("#interestInput");
// 找到兴趣名称剩余字数提示。
const interestNameCounter = document.querySelector("#interestNameCounter");
// 找到兴趣颜色选择框。
const interestColorInput = document.querySelector("#interestColorInput");
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
// 找到学习卡片统计区域。
const cardStats = document.querySelector("#cardStats");
// 找到学习卡片标题搜索框。
const cardSearchInput = document.querySelector("#cardSearchInput");
// 找到学习卡片状态筛选框。
const cardStatusFilter = document.querySelector("#cardStatusFilter");
// 找到学习卡片等级筛选框。
const cardLevelFilter = document.querySelector("#cardLevelFilter");
// 找到学习卡片排序选择框。
const cardSortSelect = document.querySelector("#cardSortSelect");
// 找到清空学习卡片筛选按钮。
const clearCardFiltersButton = document.querySelector("#clearCardFiltersButton");
// 找到学习卡片筛选说明。
const cardFilterSummary = document.querySelector("#cardFilterSummary");
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
// 找到取消编辑卡片按钮。
const cancelCardEditButton = document.querySelector("#cancelCardEditButton");
// 找到重置卡片按钮。
const resetCardsButton = document.querySelector("#resetCardsButton");
// 找到卡片区域提示信息。
const cardMessage = document.querySelector("#cardMessage");

// ===== 配置和默认数据 =====

// localStorage 只能保存字符串，所以我们用一个固定 key 找到兴趣数据。
const interestsStorageKey = "day01-interests";
// 信息卡片也需要一个独立 key，避免和兴趣数据混在一起。
const infoCardsStorageKey = "day01-info-cards";
// 学习卡片标题最长允许 12 个字符。
const cardTitleMaxLength = 12;
// 学习卡片正文最长允许 60 个字符。
const cardTextMaxLength = 60;
// 兴趣名称最长允许 12 个字符。
const interestNameMaxLength = 12;
// 对象适合保存一组有关联的信息，比如一张卡片的标题和正文。
const defaultInfoCards = [
  {
    id: "default-today",
    title: "今天学习",
    text: "HTML 负责网页结构，CSS 负责样式，JavaScript 负责交互。",
    level: "基础",
    completed: true,
  },
  {
    id: "default-goal",
    title: "近期目标",
    text: "先做出简单页面，再逐步学习 React、后端、数据库和部署。",
    level: "计划",
    completed: false,
  },
];
// 默认兴趣用于第一次打开页面，或者本地没有保存数据时。
const defaultInterests = [
  {
    id: "default-vibe-coding",
    name: "Vibe coding",
    color: "blue",
    pinned: false,
  },
  {
    id: "default-guitar",
    name: "弹吉他",
    color: "orange",
    pinned: false,
  },
  {
    id: "default-fitness",
    name: "健身",
    color: "green",
    pinned: false,
  },
];
// 用对象数组保存卡片数据，页面显示什么由它决定。
let infoCards = loadInfoCards();
// 用对象数组保存兴趣数据，每个兴趣都有自己的 id 和 name。
let interests = loadInterests();
// null 表示当前没有在编辑；字符串表示正在编辑的兴趣 id。
let editingInterestId = null;
// null 表示当前没有在编辑卡片；字符串表示正在编辑的卡片 id。
let editingCardId = null;

// ===== 数据读取和保存 =====

// 从浏览器本地读取兴趣数组。
function loadInterests() {
  const savedInterests = localStorage.getItem(interestsStorageKey);

  // 如果本地没有保存过数据，就使用默认兴趣。
  if (savedInterests === null) {
    return cloneDefaultInterests();
  }

  try {
    // JSON.parse 可以把 JSON 字符串还原成 JavaScript 数组。
    return normalizeInterests(JSON.parse(savedInterests));
  } catch {
    // 如果保存的数据坏掉了，就回到默认兴趣，避免页面打不开。
    return cloneDefaultInterests();
  }
}

// 从浏览器本地读取信息卡片对象数组。
function loadInfoCards() {
  const savedInfoCards = localStorage.getItem(infoCardsStorageKey);

  if (savedInfoCards === null) {
    return cloneDefaultInfoCards();
  }

  try {
    return normalizeInfoCards(JSON.parse(savedInfoCards));
  } catch {
    return cloneDefaultInfoCards();
  }
}

// 创建一个足够唯一的卡片 id，用来稳定识别每一张卡片。
function createCardId() {
  return `card-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// 创建一个足够唯一的兴趣 id，用来稳定识别每一个兴趣。
function createInterestId() {
  return `interest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// 复制默认卡片，避免页面数据直接改到 defaultInfoCards。
function cloneDefaultInfoCards() {
  return defaultInfoCards.map((card) => {
    return { ...card };
  });
}

// 复制默认兴趣，避免页面数据直接改到 defaultInterests。
function cloneDefaultInterests() {
  return defaultInterests.map((interest) => {
    return { ...interest };
  });
}

// 兼容旧数据：如果以前保存的卡片没有 id，就补上一个 id。
function normalizeInfoCards(cards) {
  return cards.map((card) => {
    if (card.id !== undefined) {
      return card;
    }

    return {
      ...card,
      id: createCardId(),
    };
  });
}

// 兼容旧数据：如果以前保存的是字符串兴趣，就转换成带 id 的对象。
function normalizeInterests(savedInterests) {
  return savedInterests.map((interest) => {
    if (typeof interest === "string") {
      return {
        id: createInterestId(),
        name: interest,
        color: "blue",
        pinned: false,
      };
    }

    if (interest.id !== undefined) {
      return {
        ...interest,
        color: interest.color ?? "blue",
        pinned: interest.pinned ?? false,
      };
    }

    return {
      ...interest,
      id: createInterestId(),
      color: "blue",
      pinned: false,
    };
  });
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

// ===== 通用工具和状态 =====

// 统一更新提示信息，type 用来控制提示颜色。
function showMessage(element, text, type = "info") {
  element.textContent = text;
  element.className = `message ${type}`;
}

// 根据是否处于编辑状态，更新按钮文字和取消按钮显示。
function updateInterestEditorMode() {
  if (editingInterestId === null) {
    addInterestButton.textContent = "添加兴趣";
    cancelEditButton.classList.add("hidden");
    return;
  }

  addInterestButton.textContent = "保存修改";
  cancelEditButton.classList.remove("hidden");
}

// 根据是否处于卡片编辑状态，更新按钮文字和取消按钮显示。
function updateCardEditorMode() {
  if (editingCardId === null) {
    addCardButton.textContent = "添加卡片";
    cancelCardEditButton.classList.add("hidden");
    return;
  }

  addCardButton.textContent = "保存修改";
  cancelCardEditButton.classList.remove("hidden");
}

// ===== 学习卡片模块 =====

// 根据卡片完成状态更新统计信息。
function renderCardStats() {
  const totalCount = infoCards.length;
  const completedCount = infoCards.filter((card) => {
    return card.completed;
  }).length;
  const pendingCount = totalCount - completedCount;

  cardStats.innerHTML = `
    <span class="stat-pill">全部：${totalCount}</span>
    <span class="stat-pill">已完成：${completedCount}</span>
    <span class="stat-pill">未完成：${pendingCount}</span>
  `;
}

// 根据当前筛选条件，生成一段说明文字。
function renderCardFilterSummary(searchKeyword, statusFilter, levelFilter, sortType) {
  const summaryParts = [];

  if (searchKeyword !== "") {
    summaryParts.push(`标题包含“${searchKeyword}”`);
  }

  if (statusFilter === "completed") {
    summaryParts.push("已完成");
  }

  if (statusFilter === "pending") {
    summaryParts.push("未完成");
  }

  if (levelFilter !== "all") {
    summaryParts.push(`${levelFilter}等级`);
  }

  if (sortType !== "default") {
    summaryParts.push(`排序：${cardSortSelect.options[cardSortSelect.selectedIndex].text}`);
  }

  cardFilterSummary.textContent =
    summaryParts.length === 0 ? "当前显示全部学习卡片。" : `当前筛选：${summaryParts.join(" / ")}`;
}

// 根据 infoCards 对象数组，生成页面上的信息卡片。
function renderInfoCards() {
  const searchKeyword = cardSearchInput.value.trim().toLowerCase();
  const statusFilter = cardStatusFilter.value;
  const levelFilter = cardLevelFilter.value;
  const sortType = cardSortSelect.value;
  const visibleInfoCards = infoCards
    .filter((card) => {
      const isStatusMatched =
        statusFilter === "all" ||
        (statusFilter === "completed" && card.completed) ||
        (statusFilter === "pending" && !card.completed);
      const isLevelMatched = levelFilter === "all" || card.level === levelFilter;
      const isSearchMatched = card.title.toLowerCase().includes(searchKeyword);

      return isSearchMatched && isStatusMatched && isLevelMatched;
    });
  const sortedInfoCards = [...visibleInfoCards].sort((firstItem, secondItem) => {
    if (sortType === "title") {
      return firstItem.title.localeCompare(secondItem.title, "zh-CN");
    }

    if (sortType === "completed") {
      return Number(secondItem.completed) - Number(firstItem.completed);
    }

    if (sortType === "pending") {
      return Number(firstItem.completed) - Number(secondItem.completed);
    }

    return 0;
  });

  infoGrid.innerHTML = "";
  renderCardStats();
  renderCardFilterSummary(searchKeyword, statusFilter, levelFilter, sortType);

  if (infoCards.length === 0) {
    const emptyCard = document.createElement("article");

    emptyCard.textContent = "暂无学习卡片，请添加一张。";
    emptyCard.className = "empty-card";
    infoGrid.append(emptyCard);
    return;
  }

  if (sortedInfoCards.length === 0) {
    const emptyCard = document.createElement("article");

    emptyCard.textContent = "当前筛选条件下没有学习卡片。";
    emptyCard.className = "empty-card";
    infoGrid.append(emptyCard);
    return;
  }

  sortedInfoCards.forEach((card) => {
    const article = document.createElement("article");
    const cardHeader = document.createElement("div");
    const cardTitleGroup = document.createElement("div");
    const title = document.createElement("h2");
    const level = document.createElement("span");
    const status = document.createElement("span");
    const editButton = document.createElement("button");
    const toggleButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const text = document.createElement("p");

    // 通过对象的属性名读取数据。
    title.textContent = card.title;
    level.textContent = card.level;
    level.className = `level-badge level-${card.level}`;
    status.textContent = card.completed ? "已完成" : "未完成";
    status.className = card.completed ? "status-badge completed" : "status-badge pending";
    editButton.textContent = "编辑";
    editButton.type = "button";
    editButton.className = "edit-card";
    editButton.dataset.id = card.id;
    toggleButton.textContent = card.completed ? "取消完成" : "标记完成";
    toggleButton.type = "button";
    toggleButton.className = "toggle-card";
    toggleButton.dataset.id = card.id;
    deleteButton.textContent = "删除";
    deleteButton.type = "button";
    deleteButton.className = "delete-card";
    deleteButton.dataset.id = card.id;
    text.textContent = card.text;

    cardTitleGroup.className = "card-title-group";
    cardTitleGroup.append(title, level, status);
    cardHeader.className = "card-header";
    cardHeader.append(cardTitleGroup, editButton, toggleButton, deleteButton);
    article.append(cardHeader, text);
    infoGrid.append(article);
  });
}

// 清空卡片筛选条件，恢复显示全部卡片。
function clearCardFilters() {
  cardSearchInput.value = "";
  cardStatusFilter.value = "all";
  cardLevelFilter.value = "all";
  cardSortSelect.value = "default";
  renderInfoCards();
  showMessage(cardMessage, "已清空筛选条件。", "info");
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

// 更新兴趣名称的剩余字数提示。
function updateInterestNameCounter() {
  updateCounter(interestInput, interestNameCounter, interestNameMaxLength, 2);
}

// 清空卡片表单，并把选择框恢复到默认状态。
function clearCardForm() {
  cardTitleInput.value = "";
  cardTextInput.value = "";
  cardLevelInput.value = "基础";
  updateCardTitleCounter();
  updateCardTextCounter();
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

  // 检查标题是否重复；编辑时要跳过自己，避免原标题被误判为重复。
  const isDuplicateTitle = infoCards.some((card) => {
    if (card.id === editingCardId) {
      return false;
    }

    return card.title.toLowerCase() === title.toLowerCase();
  });

  if (isDuplicateTitle) {
    showMessage(cardMessage, `“${title}”这个卡片标题已经存在。`, "error");
    return;
  }

  if (editingCardId !== null) {
    const editingCardIndex = infoCards.findIndex((card) => {
      return card.id === editingCardId;
    });

    if (editingCardIndex === -1) {
      editingCardId = null;
      updateCardEditorMode();
      showMessage(cardMessage, "正在编辑的卡片不存在，请重新选择。", "error");
      return;
    }

    const oldTitle = infoCards[editingCardIndex].title;

    // 编辑时只替换标题、正文和等级，保留原来的完成状态。
    infoCards[editingCardIndex] = {
      ...infoCards[editingCardIndex],
      title,
      text,
      level,
    };
    editingCardId = null;
    saveInfoCards();
    renderInfoCards();
    updateCardEditorMode();
    showMessage(cardMessage, `已将“${oldTitle}”修改为“${title}”。`, "success");
    clearCardForm();
    return;
  }

  // 新卡片是一个对象，对象里保存这张卡片需要的多个字段。
  const newCard = {
    id: createCardId(),
    title,
    text,
    level,
    completed: false,
  };

  infoCards.push(newCard);
  saveInfoCards();
  renderInfoCards();
  showMessage(cardMessage, `已添加卡片：${title}`, "success");
  clearCardForm();
}

// 退出卡片编辑模式，并清空表单。
function cancelCardEdit() {
  editingCardId = null;
  clearCardForm();
  updateCardEditorMode();
  showMessage(cardMessage, "已取消编辑卡片。", "info");
}

// 恢复默认学习卡片。
function resetInfoCards() {
  const shouldReset = confirm("确定要重置学习卡片吗？");

  if (!shouldReset) {
    showMessage(cardMessage, "已取消重置卡片。", "info");
    return;
  }

  // 复制默认对象数组，避免直接共用 defaultInfoCards。
  infoCards = cloneDefaultInfoCards();
  editingCardId = null;
  clearCardForm();
  saveInfoCards();
  renderInfoCards();
  updateCardEditorMode();
  showMessage(cardMessage, "学习卡片已恢复默认。", "success");
}

// ===== 兴趣模块 =====

// 根据当前兴趣筛选条件，生成一段说明文字。
function renderInterestFilterSummary(searchKeyword, pinnedFilter, colorFilter) {
  const summaryParts = [];
  const colorTextMap = {
    blue: "蓝色兴趣",
    green: "绿色兴趣",
    orange: "橙色兴趣",
  };

  if (searchKeyword !== "") {
    summaryParts.push(`名称包含“${searchKeyword}”`);
  }

  if (pinnedFilter === "pinned") {
    summaryParts.push("只看置顶");
  }

  if (colorFilter !== "all") {
    summaryParts.push(colorTextMap[colorFilter]);
  }

  interestFilterSummary.textContent =
    summaryParts.length === 0 ? "当前显示全部兴趣。" : `当前筛选：${summaryParts.join(" / ")}`;
}

// 根据 interests 数组和搜索关键词，重新生成页面上的兴趣列表。
function renderInterests() {
  const searchKeyword = searchInput.value.trim().toLowerCase();
  const pinnedFilter = interestPinnedFilter.value;
  const colorFilter = interestColorFilter.value;
  // filter 会返回一个新数组，不会修改原始 interests。
  const visibleInterests = interests.filter((interest) => {
    const isSearchMatched = interest.name.toLowerCase().includes(searchKeyword);
    const isPinnedMatched = pinnedFilter === "all" || interest.pinned;
    const isColorMatched = colorFilter === "all" || interest.color === colorFilter;

    return isSearchMatched && isPinnedMatched && isColorMatched;
  });
  // 复制一份可见兴趣再排序，避免直接改变原始 interests 顺序。
  const sortedInterests = [...visibleInterests].sort((firstItem, secondItem) => {
    return Number(secondItem.pinned) - Number(firstItem.pinned);
  });

  // 先清空列表，避免重复渲染出多份 li。
  interestList.innerHTML = "";
  renderInterestFilterSummary(searchKeyword, pinnedFilter, colorFilter);
  // length 表示数组里有多少项。
  interestCount.textContent =
    searchKeyword === "" && pinnedFilter === "all" && colorFilter === "all"
      ? `${interests.length} 项`
      : `${sortedInterests.length}/${interests.length} 项`;

  // 如果数组为空，就显示一个空状态提示。
  if (interests.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.textContent = "暂无兴趣，请添加一个。";
    emptyItem.className = "empty-item";
    interestList.append(emptyItem);
    return;
  }

  // 如果有数据但搜索结果为空，就显示“没有匹配结果”。
  if (sortedInterests.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.textContent = "没有匹配的兴趣。";
    emptyItem.className = "empty-item";
    interestList.append(emptyItem);
    return;
  }

  // forEach 会遍历数组里的每一项。
  sortedInterests.forEach((interest) => {
    const listItem = document.createElement("li");
    const interestText = document.createElement("span");
    const pinButton = document.createElement("button");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    listItem.className = `interest-item interest-${interest.color}`;
    listItem.classList.toggle("pinned-interest", interest.pinned);
    interestText.textContent = interest.name;
    pinButton.textContent = interest.pinned ? "取消置顶" : "置顶";
    pinButton.type = "button";
    pinButton.className = "pin-interest";
    pinButton.dataset.id = interest.id;
    editButton.textContent = "编辑";
    editButton.type = "button";
    editButton.className = "edit-interest";
    editButton.dataset.id = interest.id;
    deleteButton.textContent = "删除";
    deleteButton.type = "button";
    deleteButton.className = "delete-interest";
    // dataset 可以把数据藏在 HTML 元素上，这里保存它的唯一 id。
    deleteButton.dataset.id = interest.id;

    listItem.append(interestText, pinButton, editButton, deleteButton);
    interestList.append(listItem);
  });
}

// 清空兴趣筛选条件，恢复显示全部兴趣。
function clearInterestFilters() {
  searchInput.value = "";
  interestPinnedFilter.value = "all";
  interestColorFilter.value = "all";
  renderInterests();
  showMessage(interestMessage, "已清空兴趣筛选条件。", "info");
}

// 清空兴趣表单，并把颜色选择恢复到默认蓝色。
function clearInterestForm() {
  interestInput.value = "";
  interestColorInput.value = "blue";
  updateInterestNameCounter();
}

// 判断兴趣名称是否重复；编辑时跳过正在编辑的那一项。
function isDuplicateInterestName(name) {
  return interests.some((interest) => {
    if (interest.id === editingInterestId) {
      return false;
    }

    return interest.name.toLowerCase() === name.toLowerCase();
  });
}

// 根据兴趣 id 找到它在 interests 数组里的位置。
function findInterestIndexById(id) {
  return interests.findIndex((interest) => {
    return interest.id === id;
  });
}

// 创建一条完整的兴趣数据，统一管理兴趣对象的默认字段。
function createInterest(name, color) {
  return {
    id: createInterestId(),
    name,
    color,
    pinned: false,
  };
}

// ===== 基础交互 =====

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
  const newInterestColor = interestColorInput.value;

  if (newInterest === "") {
    showMessage(interestMessage, "请先输入一个兴趣。", "error");
    return;
  }

  if (newInterest.length > interestNameMaxLength) {
    showMessage(interestMessage, `兴趣名称不能超过 ${interestNameMaxLength} 个字。`, "error");
    return;
  }

  // 如果兴趣已经存在，就提示用户，并停止新增。
  if (isDuplicateInterestName(newInterest)) {
    showMessage(interestMessage, `“${newInterest}”已经在兴趣列表里了。`, "error");
    return;
  }

  if (editingInterestId !== null) {
    const editingInterestIndex = findInterestIndexById(editingInterestId);

    if (editingInterestIndex === -1) {
      editingInterestId = null;
      updateInterestEditorMode();
      showMessage(interestMessage, "正在编辑的兴趣不存在，请重新选择。", "error");
      return;
    }

    const oldInterestName = interests[editingInterestIndex].name;

    interests[editingInterestIndex] = {
      ...interests[editingInterestIndex],
      name: newInterest,
      color: newInterestColor,
    };
    editingInterestId = null;
    saveInterests();
    renderInterests();
    updateInterestEditorMode();
    showMessage(interestMessage, `已将“${oldInterestName}”修改为“${newInterest}”`, "success");
    clearInterestForm();
    return;
  }

  // push 会把新内容添加到数组末尾。
  interests.push(createInterest(newInterest, newInterestColor));
  saveInterests();
  renderInterests();
  showMessage(interestMessage, `已添加兴趣：${newInterest}`, "success");
  clearInterestForm();
}

// ===== 事件绑定 =====

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

// 切换完成状态筛选时，重新渲染可见卡片。
cardStatusFilter.addEventListener("change", () => {
  renderInfoCards();
});

// 输入卡片标题关键词时，实时重新渲染可见卡片。
cardSearchInput.addEventListener("input", () => {
  renderInfoCards();
});

// 切换等级筛选时，重新渲染可见卡片。
cardLevelFilter.addEventListener("change", () => {
  renderInfoCards();
});

// 切换排序方式时，重新渲染可见卡片。
cardSortSelect.addEventListener("change", () => {
  renderInfoCards();
});

// 点击按钮时，清空所有卡片筛选条件。
clearCardFiltersButton.addEventListener("click", () => {
  clearCardFilters();
});

// 点击按钮时，恢复默认学习卡片。
resetCardsButton.addEventListener("click", () => {
  resetInfoCards();
});

// 点击按钮时，取消正在编辑的学习卡片。
cancelCardEditButton.addEventListener("click", () => {
  cancelCardEdit();
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

  const cardId = clickedElement.dataset.id;
  const cardIndex = infoCards.findIndex((card) => {
    return card.id === cardId;
  });

  if (cardIndex === -1) {
    return;
  }

  if (clickedElement.classList.contains("edit-card")) {
    const card = infoCards[cardIndex];

    editingCardId = card.id;
    cardTitleInput.value = card.title;
    cardTextInput.value = card.text;
    cardLevelInput.value = card.level;
    cardTitleInput.focus();
    updateCardEditorMode();
    updateCardTitleCounter();
    updateCardTextCounter();
    showMessage(cardMessage, "正在编辑卡片，修改后点击“保存修改”。", "info");
    return;
  }

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

  // 因为编辑状态记录的是 id，所以删除其他卡片不会影响当前编辑对象。
  if (cardId === editingCardId) {
    editingCardId = null;
    clearCardForm();
  }

  saveInfoCards();
  renderInfoCards();
  updateCardEditorMode();
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

// 输入兴趣名称时，实时更新剩余字数。
interestInput.addEventListener("input", () => {
  updateInterestNameCounter();
});

// 输入搜索关键词时，实时重新渲染可见列表。
searchInput.addEventListener("input", () => {
  renderInterests();
});

// 切换置顶筛选时，重新渲染兴趣列表。
interestPinnedFilter.addEventListener("change", () => {
  renderInterests();
});

// 切换颜色筛选时，重新渲染兴趣列表。
interestColorFilter.addEventListener("change", () => {
  renderInterests();
});

// 点击按钮时，清空所有兴趣筛选条件。
clearInterestFiltersButton.addEventListener("click", () => {
  clearInterestFilters();
});

// 事件委托：把点击监听放在 ul 上，统一处理所有删除按钮。
interestList.addEventListener("click", (event) => {
  // event.target 表示用户实际点击到的元素。
  const clickedElement = event.target;
  const interestId = clickedElement.dataset.id;
  const interestIndex = findInterestIndexById(interestId);

  if (interestIndex === -1) {
    return;
  }

  if (clickedElement.classList.contains("pin-interest")) {
    interests[interestIndex].pinned = !interests[interestIndex].pinned;
    saveInterests();
    renderInterests();
    showMessage(
      interestMessage,
      interests[interestIndex].pinned
        ? `已置顶兴趣：${interests[interestIndex].name}`
        : `已取消置顶：${interests[interestIndex].name}`,
      "success",
    );
    return;
  }

  if (clickedElement.classList.contains("edit-interest")) {
    editingInterestId = interests[interestIndex].id;
    interestInput.value = interests[interestIndex].name;
    interestColorInput.value = interests[interestIndex].color;
    interestInput.focus();
    updateInterestEditorMode();
    updateInterestNameCounter();
    showMessage(interestMessage, "正在编辑兴趣，修改后点击“保存修改”。", "info");
    return;
  }

  if (clickedElement.classList.contains("delete-interest")) {
    const interestName = interests[interestIndex].name;

    // splice 会从数组里删除指定位置的数据。
    interests.splice(interestIndex, 1);

    // 因为编辑状态记录的是 id，所以删除其他兴趣不会影响当前编辑对象。
    if (interestId === editingInterestId) {
      editingInterestId = null;
      clearInterestForm();
    }

    saveInterests();
    renderInterests();
    updateInterestEditorMode();
    showMessage(interestMessage, `已删除兴趣：${interestName}`, "success");
  }
});

// 取消编辑时，清空输入框并恢复为新增模式。
cancelEditButton.addEventListener("click", () => {
  editingInterestId = null;
  clearInterestForm();
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

  // 复制默认对象数组，避免直接共用 defaultInterests 这个原始数组。
  interests = cloneDefaultInterests();
  editingInterestId = null;
  clearInterestForm();
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
  editingInterestId = null;
  clearInterestForm();
  saveInterests();
  renderInterests();
  updateInterestEditorMode();
  showMessage(interestMessage, "全部兴趣已清空。", "success");
});

// ===== 页面初始化 =====

// 页面刚打开时，先把默认兴趣渲染出来。
renderInfoCards();
renderInterests();
updateInterestEditorMode();
updateCardEditorMode();
updateCardTitleCounter();
updateCardTextCounter();
updateInterestNameCounter();
