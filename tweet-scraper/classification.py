import requests
import json
import argparse
from typing import Dict, Any, Optional, List, Union

class OllamaClient:
    """Client for interacting with locally running Ollama models."""
    
    def __init__(self, host: str = "http://localhost:11434"):
        """Initialize the Ollama client.
        
        Args:
            host: The URL where Ollama is running
        """
        self.host = host
        self.api_base = f"{host}/api"
    
    def list_models(self) -> List[Dict[str, Any]]:
        """List all available models."""
        response = requests.get(f"{self.api_base}/tags")
        return response.json().get("models", [])
    
    def generate(self, 
                 prompt: str, 
                 model: str = "llama2", 
                 system_prompt: Optional[str] = None,
                 temperature: float = 0.7,
                 max_tokens: int = 500) -> Dict[str, Any]:
        """Generate a response from the model.
        
        Args:
            prompt: The prompt to send to the model
            model: The name of the model to use
            system_prompt: Optional system prompt to guide the model behavior
            temperature: Controls randomness (higher = more random)
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            The model's response
        """
        payload = {
            "model": model,
            "prompt": prompt,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        
        if system_prompt:
            payload["system"] = system_prompt
            
        response = requests.post(f"{self.api_base}/generate", json=payload)
        return response.json()
    
    def generate_stream(self, 
                       prompt: str, 
                       model: str = "llama2", 
                       system_prompt: Optional[str] = None,
                       temperature: float = 0.7,
                       max_tokens: int = 500) -> str:
        """Generate a streaming response from the model and return final text.
        
        Args:
            prompt: The prompt to send to the model
            model: The name of the model to use
            system_prompt: Optional system prompt to guide the model behavior
            temperature: Controls randomness (higher = more random)
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            The complete generated text
        """
        payload = {
            "model": model,
            "prompt": prompt,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True
        }
        
        if system_prompt:
            payload["system"] = system_prompt
            
        response = requests.post(f"{self.api_base}/generate", json=payload, stream=True)
        
        full_response = ""
        for line in response.iter_lines():
            if line:
                chunk = json.loads(line)
                if "response" in chunk:
                    text_chunk = chunk["response"]
                    full_response += text_chunk
                    print(text_chunk, end="", flush=True)
                    
                # Check if we reached the end of the response
                if chunk.get("done", False):
                    break
        
        print()  # Add final newline
        return full_response

def main():
    parser = argparse.ArgumentParser(description="Call Ollama models locally")
    parser.add_argument("--model", type=str, default="llama2", help="Model name to use")
    parser.add_argument("--host", type=str, default="http://localhost:11434", help="Ollama host URL")
    parser.add_argument("--temperature", type=float, default=0.7, help="Temperature for generation")
    parser.add_argument("--max-tokens", type=int, default=500, help="Maximum tokens to generate")
    parser.add_argument("--system", type=str, help="Optional system prompt")
    parser.add_argument("--list-models", action="store_true", help="List available models")
    parser.add_argument("--prompt", type=str, help="Prompt to send to the model")
    parser.add_argument("--no-stream", action="store_true", help="Disable streaming responses")
    
    args = parser.parse_args()
    
    client = OllamaClient(host=args.host)
    
    if args.list_models:
        models = client.list_models()
        print("Available models:")
        for model in models:
            print(f"- {model['name']}")
        return
    
    if not args.prompt:
        args.prompt = input("Enter your prompt: ")
    
    if args.no_stream:
        response = client.generate(
            prompt=args.prompt,
            model=args.model,
            system_prompt=args.system,
            temperature=args.temperature,
            max_tokens=args.max_tokens
        )
        print(response.get("response", "No response received."))
    else:
        client.generate_stream(
            prompt=args.prompt,
            model=args.model,
            system_prompt=args.system,
            temperature=args.temperature,
            max_tokens=args.max_tokens
        )

if __name__ == "__main__":
    main()
