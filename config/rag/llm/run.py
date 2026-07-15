from chatbot import ask

print("=== AI Chatbot ===")

while True:

    prompt = input("You: ")

    if prompt.lower() in ["bye", "quit", "exit"]:
        print("AI: Goodbye! 👋")
        break

    response, _, _ = ask(prompt)

    print("AI:", response)