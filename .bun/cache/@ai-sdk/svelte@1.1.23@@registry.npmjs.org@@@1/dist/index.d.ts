import { UseChatOptions as UseChatOptions$1, UIMessage, Message, CreateMessage, ChatRequestOptions, JSONValue, RequestOptions, UseCompletionOptions, AssistantStatus, UseAssistantOptions } from '@ai-sdk/ui-utils';
export { CreateMessage, Message, UseCompletionOptions } from '@ai-sdk/ui-utils';
import { Readable, Writable } from 'svelte/store';

type UseChatOptions = UseChatOptions$1 & {
    /**
  Maximum number of sequential LLM calls (steps), e.g. when you use tool calls. Must be at least 1.
  
  A maximum number is required to prevent infinite loops in the case of misconfigured tools.
  
  By default, it's set to 1, which means that only a single LLM call is made.
   */
    maxSteps?: number;
};
type UseChatHelpers = {
    /** Current messages in the chat */
    messages: Readable<UIMessage[]>;
    /** The error object of the API request */
    error: Readable<undefined | Error>;
    /**
     * Append a user message to the chat list. This triggers the API call to fetch
     * the assistant's response.
     * @param message The message to append
     * @param chatRequestOptions Additional options to pass to the API call
     */
    append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
    /**
     * Reload the last AI chat response for the given chat history. If the last
     * message isn't from the assistant, it will request the API to generate a
     * new response.
     */
    reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
    /**
     * Abort the current request immediately, keep the generated tokens if any.
     */
    stop: () => void;
    /**
     * Update the `messages` state locally. This is useful when you want to
     * edit the messages on the client, and then trigger the `reload` method
     * manually to regenerate the AI response.
     */
    setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
    /** The current value of the input */
    input: Writable<string>;
    /** Form submission handler to automatically reset input and append a user message  */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }, chatRequestOptions?: ChatRequestOptions) => void;
    metadata?: Object;
    /**
     * Whether the API request is in progress
     *
     * @deprecated use `status` instead
     */
    isLoading: Readable<boolean | undefined>;
    /**
     * Hook status:
     *
     * - `submitted`: The message has been sent to the API and we're awaiting the start of the response stream.
     * - `streaming`: The response is actively streaming in from the API, receiving chunks of data.
     * - `ready`: The full response has been received and processed; a new user message can be submitted.
     * - `error`: An error occurred during the API request, preventing successful completion.
     */
    status: Readable<'submitted' | 'streaming' | 'ready' | 'error'>;
    /** Additional data added on the server via StreamData */
    data: Readable<JSONValue[] | undefined>;
    /** Set the data of the chat. You can use this to transform or clear the chat data. */
    setData: (data: JSONValue[] | undefined | ((data: JSONValue[] | undefined) => JSONValue[] | undefined)) => void;
    /** The id of the chat */
    id: string;
};
declare function useChat({ api, id, initialMessages, initialInput, sendExtraMessageFields, streamProtocol, onResponse, onFinish, onError, onToolCall, credentials, headers, body, generateId, fetch, keepLastMessageOnError, maxSteps, }?: UseChatOptions): UseChatHelpers & {
    addToolResult: ({ toolCallId, result, }: {
        toolCallId: string;
        result: any;
    }) => void;
};

type UseCompletionHelpers = {
    /** The current completion result */
    completion: Readable<string>;
    /** The error object of the API request */
    error: Readable<undefined | Error>;
    /**
     * Send a new prompt to the API endpoint and update the completion state.
     */
    complete: (prompt: string, options?: RequestOptions) => Promise<string | null | undefined>;
    /**
     * Abort the current API request but keep the generated tokens.
     */
    stop: () => void;
    /**
     * Update the `completion` state locally.
     */
    setCompletion: (completion: string) => void;
    /** The current value of the input */
    input: Writable<string>;
    /**
     * Form submission handler to automatically reset input and append a user message
     * @example
     * ```jsx
     * <form onSubmit={handleSubmit}>
     *  <input onChange={handleInputChange} value={input} />
     * </form>
     * ```
     */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => void;
    /** Whether the API request is in progress */
    isLoading: Readable<boolean | undefined>;
    /** Additional data added on the server via StreamData */
    data: Readable<JSONValue[] | undefined>;
};
declare function useCompletion({ api, id, initialCompletion, initialInput, credentials, headers, body, streamProtocol, onResponse, onFinish, onError, fetch, }?: UseCompletionOptions): UseCompletionHelpers;

type UseAssistantHelpers = {
    /**
     * The current array of chat messages.
     */
    messages: Readable<Message[]>;
    /**
     * Update the message store with a new array of messages.
     */
    setMessages: (messages: Message[]) => void;
    /**
     * The current thread ID.
     */
    threadId: Readable<string | undefined>;
    /**
     * The current value of the input field.
     */
    input: Writable<string>;
    /**
     * Append a user message to the chat list. This triggers the API call to fetch
     * the assistant's response.
     * @param message The message to append
     * @param requestOptions Additional options to pass to the API call
     */
    append: (message: Message | CreateMessage, requestOptions?: {
        data?: Record<string, string>;
    }) => Promise<void>;
    /**
  Abort the current request immediately, keep the generated tokens if any.
     */
    stop: () => void;
    /**
     * Form submission handler that automatically resets the input field and appends a user message.
     */
    submitMessage: (event?: {
        preventDefault?: () => void;
    }, requestOptions?: {
        data?: Record<string, string>;
    }) => Promise<void>;
    /**
     * The current status of the assistant. This can be used to show a loading indicator.
     */
    status: Readable<AssistantStatus>;
    /**
     * The error thrown during the assistant message processing, if any.
     */
    error: Readable<undefined | Error>;
};
declare function useAssistant({ api, threadId: threadIdParam, credentials, headers, body, onError, fetch, }: UseAssistantOptions): UseAssistantHelpers;

export { UseAssistantHelpers, UseChatHelpers, UseChatOptions, UseCompletionHelpers, useAssistant, useChat, useCompletion };
