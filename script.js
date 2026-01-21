const baseUrl = (idInstance, apiTokenInstance, method) =>
  `https://api.green-api.com/waInstance${idInstance}/${method}/${apiTokenInstance}`;

const responseEl = document.getElementById("response");

function setLoading(isLoading) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((b) => (b.disabled = isLoading));
}

function printResponse(data) {
  responseEl.value = JSON.stringify(data, null, 2);
}

function getCommonParams() {
  const idInstance = document.getElementById("idInstance").value.trim();
  const apiTokenInstance = document.getElementById("apiTokenInstance").value.trim();

  if (!idInstance || !apiTokenInstance) {
    alert("Заполните idInstance и ApiTokenInstance");
    throw new Error("Missing credentials");
  }
  return { idInstance, apiTokenInstance };
}

async function callGreenApi(method, payload) {
  const { idInstance, apiTokenInstance } = getCommonParams();
  const url = baseUrl(idInstance, apiTokenInstance, method);

  const options = payload
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    : { method: "GET" };

  setLoading(true);
  try {
    const res = await fetch(url, options);
    const json = await res.json().catch(() => ({}));
    printResponse(json);
  } catch (e) {
    printResponse({ error: e.message || String(e) });
  } finally {
    setLoading(false);
  }
}

document.getElementById("btnGetSettings").addEventListener("click", () => {
  callGreenApi("getSettings");
});

document.getElementById("btnGetState").addEventListener("click", () => {
  callGreenApi("getStateInstance");
});

document.getElementById("btnSendMessage").addEventListener("click", () => {
  const phone = document.getElementById("phone").value.trim();
  const text = document.getElementById("messageText").value.trim();

  if (!phone || !text) {
    alert("Укажите телефон и текст сообщения");
    return;
  }

  const chatId = `${phone}@c.us`;
  callGreenApi("sendMessage", {
    chatId,
    message: text,
  });
});

document.getElementById("btnSendFile").addEventListener("click", () => {
  const phone = document.getElementById("filePhone").value.trim();
  const fileUrl = document.getElementById("fileUrl").value.trim();

  if (!phone || !fileUrl) {
    alert("Укажите телефон и URL файла");
    return;
  }

  const chatId = `${phone}@c.us`;
  callGreenApi("sendFileByUrl", {
    chatId,
    urlFile: fileUrl,
    fileName: fileUrl.split("/").pop() || "file",
    caption: "",
  });
});
