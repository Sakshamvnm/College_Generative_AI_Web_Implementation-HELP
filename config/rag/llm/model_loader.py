from transformers import AutoModelForCausalLM, AutoTokenizer

checkpoint = "HuggingFaceTB/SmolLM2-1.7B-Instruct"

device= "cpu" # for GPU usage or "cpu" for CPU usage

tokenizer= AutoTokenizer.from_pretrained(checkpoint)

model= AutoModelForCausalLM.from_pretrained(checkpoint).to(device)  