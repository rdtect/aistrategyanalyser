"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useAssistant: () => useAssistant,
  useChat: () => useChat,
  useCompletion: () => useCompletion
});
module.exports = __toCommonJS(src_exports);

// src/use-chat.ts
var import_ui_utils = require("@ai-sdk/ui-utils");
var import_store = require("svelte/store");
var store = (0, import_store.writable)({});
function useChat({
  api = "/api/chat",
  id,
  initialMessages = [],
  initialInput = "",
  sendExtraMessageFields,
  streamProtocol = "data",
  onResponse,
  onFinish,
  onError,
  onToolCall,
  credentials,
  headers,
  body,
  generateId: generateId2 = import_ui_utils.generateId,
  fetch: fetch2,
  keepLastMessageOnError = true,
  maxSteps = 1
} = {}) {
  const chatId = id != null ? id : generateId2();
  const key = `${api}|${chatId}`;
  const messages = (0, import_store.derived)(
    [store],
    ([$store]) => {
      var _a;
      return (_a = $store[key]) != null ? _a : (0, import_ui_utils.fillMessageParts)(initialMessages);
    }
  );
  const streamData = (0, import_store.writable)(void 0);
  const status = (0, import_store.writable)(
    "ready"
  );
  const mutate = (data) => {
    store.update((value) => {
      value[key] = data;
      return value;
    });
  };
  let abortController = null;
  const extraMetadata = {
    credentials,
    headers,
    body
  };
  const error = (0, import_store.writable)(void 0);
  async function triggerRequest(chatRequest) {
    var _a;
    status.set("submitted");
    error.set(void 0);
    const messagesSnapshot = (0, import_store.get)(messages);
    const messageCount = messagesSnapshot.length;
    const maxStep = (0, import_ui_utils.extractMaxToolInvocationStep)(
      (_a = chatRequest.messages[chatRequest.messages.length - 1]) == null ? void 0 : _a.toolInvocations
    );
    try {
      abortController = new AbortController();
      const chatMessages = (0, import_ui_utils.fillMessageParts)(chatRequest.messages);
      mutate(chatMessages);
      const existingData = (0, import_store.get)(streamData);
      const previousMessages = (0, import_store.get)(messages);
      const constructedMessagesPayload = sendExtraMessageFields ? chatMessages : chatMessages.map(
        ({
          role,
          content,
          experimental_attachments,
          data,
          annotations,
          toolInvocations,
          parts
        }) => ({
          role,
          content,
          ...experimental_attachments !== void 0 && {
            experimental_attachments
          },
          ...data !== void 0 && { data },
          ...annotations !== void 0 && { annotations },
          ...toolInvocations !== void 0 && { toolInvocations },
          ...parts !== void 0 && { parts }
        })
      );
      await (0, import_ui_utils.callChatApi)({
        api,
        body: {
          id: chatId,
          messages: constructedMessagesPayload,
          data: chatRequest.data,
          ...extraMetadata.body,
          ...chatRequest.body
        },
        streamProtocol,
        credentials: extraMetadata.credentials,
        headers: {
          ...extraMetadata.headers,
          ...chatRequest.headers
        },
        abortController: () => abortController,
        restoreMessagesOnFailure() {
          if (!keepLastMessageOnError) {
            mutate(previousMessages);
          }
        },
        onResponse,
        onUpdate({ message, data, replaceLastMessage }) {
          status.set("streaming");
          mutate([
            ...replaceLastMessage ? chatMessages.slice(0, chatMessages.length - 1) : chatMessages,
            message
          ]);
          if (data == null ? void 0 : data.length) {
            streamData.set([...existingData != null ? existingData : [], ...data]);
          }
        },
        onFinish,
        generateId: generateId2,
        onToolCall,
        fetch: fetch2,
        lastMessage: chatMessages[chatMessages.length - 1]
      });
      status.set("ready");
    } catch (err) {
      if (err.name === "AbortError") {
        abortController = null;
        status.set("ready");
        return null;
      }
      if (onError && err instanceof Error) {
        onError(err);
      }
      error.set(err);
      status.set("error");
    } finally {
      abortController = null;
    }
    const newMessagesSnapshot = (0, import_store.get)(messages);
    if ((0, import_ui_utils.shouldResubmitMessages)({
      originalMaxToolInvocationStep: maxStep,
      originalMessageCount: messageCount,
      maxSteps,
      messages: newMessagesSnapshot
    })) {
      await triggerRequest({ messages: newMessagesSnapshot });
    }
  }
  const append = async (message, { data, headers: headers2, body: body2, experimental_attachments } = {}) => {
    var _a, _b;
    const attachmentsForRequest = await (0, import_ui_utils.prepareAttachmentsForRequest)(
      experimental_attachments
    );
    return triggerRequest({
      messages: (0, import_store.get)(messages).concat({
        ...message,
        id: (_a = message.id) != null ? _a : generateId2(),
        createdAt: (_b = message.createdAt) != null ? _b : /* @__PURE__ */ new Date(),
        experimental_attachments: attachmentsForRequest.length > 0 ? attachmentsForRequest : void 0,
        parts: (0, import_ui_utils.getMessageParts)(message)
      }),
      headers: headers2,
      body: body2,
      data
    });
  };
  const reload = async ({
    data,
    headers: headers2,
    body: body2
  } = {}) => {
    const messagesSnapshot = (0, import_store.get)(messages);
    if (messagesSnapshot.length === 0) {
      return null;
    }
    const lastMessage = messagesSnapshot.at(-1);
    return triggerRequest({
      messages: (lastMessage == null ? void 0 : lastMessage.role) === "assistant" ? messagesSnapshot.slice(0, -1) : messagesSnapshot,
      headers: headers2,
      body: body2,
      data
    });
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setMessages = (messagesArg) => {
    if (typeof messagesArg === "function") {
      messagesArg = messagesArg((0, import_store.get)(messages));
    }
    mutate((0, import_ui_utils.fillMessageParts)(messagesArg));
  };
  const setData = (dataArg) => {
    if (typeof dataArg === "function") {
      dataArg = dataArg((0, import_store.get)(streamData));
    }
    streamData.set(dataArg);
  };
  const input = (0, import_store.writable)(initialInput);
  const handleSubmit = async (event, options = {}) => {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = (0, import_store.get)(input);
    if (!inputValue && !options.allowEmptySubmit)
      return;
    const attachmentsForRequest = await (0, import_ui_utils.prepareAttachmentsForRequest)(
      options.experimental_attachments
    );
    triggerRequest({
      messages: (0, import_store.get)(messages).concat({
        id: generateId2(),
        content: inputValue,
        role: "user",
        createdAt: /* @__PURE__ */ new Date(),
        experimental_attachments: attachmentsForRequest.length > 0 ? attachmentsForRequest : void 0,
        parts: [{ type: "text", text: inputValue }]
      }),
      body: options.body,
      headers: options.headers,
      data: options.data
    });
    input.set("");
  };
  const addToolResult = ({
    toolCallId,
    result
  }) => {
    var _a;
    const messagesSnapshot = (_a = (0, import_store.get)(messages)) != null ? _a : [];
    (0, import_ui_utils.updateToolCallResult)({
      messages: messagesSnapshot,
      toolCallId,
      toolResult: result
    });
    mutate(messagesSnapshot);
    const lastMessage = messagesSnapshot[messagesSnapshot.length - 1];
    if ((0, import_ui_utils.isAssistantMessageWithCompletedToolCalls)(lastMessage)) {
      triggerRequest({ messages: messagesSnapshot });
    }
  };
  return {
    id: chatId,
    messages,
    error,
    append,
    reload,
    stop,
    setMessages,
    input,
    handleSubmit,
    isLoading: (0, import_store.derived)(
      status,
      ($status) => $status === "submitted" || $status === "streaming"
    ),
    status,
    data: streamData,
    setData,
    addToolResult
  };
}

// src/use-completion.ts
var import_ui_utils2 = require("@ai-sdk/ui-utils");
var import_store2 = require("svelte/store");
var uniqueId = 0;
var store2 = (0, import_store2.writable)({});
function useCompletion({
  api = "/api/completion",
  id,
  initialCompletion = "",
  initialInput = "",
  credentials,
  headers,
  body,
  streamProtocol = "data",
  onResponse,
  onFinish,
  onError,
  fetch: fetch2
} = {}) {
  const completionId = id || `completion-${uniqueId++}`;
  const key = `${api}|${completionId}`;
  const data = (0, import_store2.derived)([store2], ([$store]) => {
    var _a;
    return (_a = $store[key]) != null ? _a : initialCompletion;
  });
  const streamData = (0, import_store2.writable)(void 0);
  const loading = (0, import_store2.writable)(false);
  const mutate = (data2) => {
    store2.update((value) => {
      value[key] = data2;
      return value;
    });
  };
  const completion = data;
  const error = (0, import_store2.writable)(void 0);
  let abortController = null;
  const complete = async (prompt, options) => {
    const existingData = (0, import_store2.get)(streamData);
    return (0, import_ui_utils2.callCompletionApi)({
      api,
      prompt,
      credentials,
      headers: {
        ...headers,
        ...options == null ? void 0 : options.headers
      },
      body: {
        ...body,
        ...options == null ? void 0 : options.body
      },
      streamProtocol,
      setCompletion: mutate,
      setLoading: (loadingState) => loading.set(loadingState),
      setError: (err) => error.set(err),
      setAbortController: (controller) => {
        abortController = controller;
      },
      onResponse,
      onFinish,
      onError,
      onData(data2) {
        streamData.set([...existingData || [], ...data2 || []]);
      },
      fetch: fetch2
    });
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setCompletion = (completion2) => {
    mutate(completion2);
  };
  const input = (0, import_store2.writable)(initialInput);
  const handleSubmit = (event) => {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = (0, import_store2.get)(input);
    return inputValue ? complete(inputValue) : void 0;
  };
  return {
    completion,
    complete,
    error,
    stop,
    setCompletion,
    input,
    handleSubmit,
    isLoading: loading,
    data: streamData
  };
}

// src/use-assistant.ts
var import_provider_utils = require("@ai-sdk/provider-utils");
var import_ui_utils3 = require("@ai-sdk/ui-utils");
var import_store3 = require("svelte/store");
var getOriginalFetch = () => fetch;
var uniqueId2 = 0;
var store3 = {};
function useAssistant({
  api,
  threadId: threadIdParam,
  credentials,
  headers,
  body,
  onError,
  fetch: fetch2
}) {
  const threadIdStore = (0, import_store3.writable)(threadIdParam);
  const key = `${api}|${threadIdParam != null ? threadIdParam : `completion-${uniqueId2++}`}`;
  const messages = (0, import_store3.writable)(store3[key] || []);
  const input = (0, import_store3.writable)("");
  const status = (0, import_store3.writable)("awaiting_message");
  const error = (0, import_store3.writable)(void 0);
  let abortController = null;
  const mutateMessages = (newMessages) => {
    store3[key] = newMessages;
    messages.set(newMessages);
  };
  async function append(message, requestOptions) {
    var _a, _b, _c, _d;
    status.set("in_progress");
    abortController = new AbortController();
    mutateMessages([
      ...(0, import_store3.get)(messages),
      { ...message, id: (_a = message.id) != null ? _a : (0, import_ui_utils3.generateId)() }
    ]);
    input.set("");
    try {
      const actualFetch = fetch2 != null ? fetch2 : getOriginalFetch();
      const response = await actualFetch(api, {
        method: "POST",
        credentials,
        signal: abortController.signal,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          ...body,
          // always use user-provided threadId when available:
          threadId: (_b = threadIdParam != null ? threadIdParam : (0, import_store3.get)(threadIdStore)) != null ? _b : null,
          message: message.content,
          // optional request data:
          data: requestOptions == null ? void 0 : requestOptions.data
        })
      });
      if (!response.ok) {
        throw new Error(
          (_c = await response.text()) != null ? _c : "Failed to fetch the assistant response."
        );
      }
      if (response.body == null) {
        throw new Error("The response body is empty.");
      }
      await (0, import_ui_utils3.processAssistantStream)({
        stream: response.body,
        onAssistantMessagePart(value) {
          mutateMessages([
            ...(0, import_store3.get)(messages),
            {
              id: value.id,
              role: value.role,
              content: value.content[0].text.value,
              parts: []
            }
          ]);
        },
        onTextPart(value) {
          mutateMessages(
            (0, import_store3.get)(messages).map((msg, index, array) => {
              if (index === array.length - 1) {
                return { ...msg, content: msg.content + value };
              }
              return msg;
            })
          );
        },
        onAssistantControlDataPart(value) {
          threadIdStore.set(value.threadId);
          mutateMessages(
            (0, import_store3.get)(messages).map((msg, index, array) => {
              if (index === array.length - 1) {
                return { ...msg, id: value.messageId };
              }
              return msg;
            })
          );
        },
        onDataMessagePart(value) {
          var _a2;
          mutateMessages([
            ...(0, import_store3.get)(messages),
            {
              id: (_a2 = value.id) != null ? _a2 : (0, import_ui_utils3.generateId)(),
              role: "data",
              content: "",
              data: value.data,
              parts: []
            }
          ]);
        },
        onErrorPart(value) {
          error.set(new Error(value));
        }
      });
    } catch (err) {
      if ((0, import_provider_utils.isAbortError)(error) && ((_d = abortController == null ? void 0 : abortController.signal) == null ? void 0 : _d.aborted)) {
        abortController = null;
        return;
      }
      if (onError && err instanceof Error) {
        onError(err);
      }
      error.set(err);
    } finally {
      abortController = null;
      status.set("awaiting_message");
    }
  }
  function setMessages(messages2) {
    mutateMessages(messages2);
  }
  function stop() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }
  async function submitMessage(event, requestOptions) {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = (0, import_store3.get)(input);
    if (!inputValue)
      return;
    await append(
      { role: "user", content: inputValue, parts: [] },
      requestOptions
    );
  }
  return {
    messages,
    error,
    threadId: threadIdStore,
    input,
    append,
    submitMessage,
    status,
    setMessages,
    stop
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAssistant,
  useChat,
  useCompletion
});
//# sourceMappingURL=index.js.map