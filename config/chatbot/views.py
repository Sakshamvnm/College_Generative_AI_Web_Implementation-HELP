import json
import torch

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from transformers import AutoTokenizer, AutoModelForCausalLM

# Load model only once when Django starts
checkpoint = "Qwen/Qwen2.5-0.5B-Instruct"

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForCausalLM.from_pretrained(checkpoint).to(device)


def home(request):
    return render(request, "chatbot/index.html")


@csrf_exempt
def chat(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
        prompt = data.get("prompt", "")

        print("Prompt:", prompt)

        messages = [
            {
                "role": "user",
                "content": prompt
            }
        ]

        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        inputs = tokenizer(text, return_tensors="pt").to(device)

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=2560,
                do_sample=True,
                temperature=0.7
            )

        answer = tokenizer.decode(
            outputs[0][inputs.input_ids.shape[1]:],
            skip_special_tokens=True
        )

        print("Answer:", answer)

        return JsonResponse({
            "answer": answer
        })

    except Exception as e:
        print(e)
        return JsonResponse({
            "answer": str(e)
        }, status=500)