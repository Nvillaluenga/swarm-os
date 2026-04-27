import time

def call_with_retry(func, *args, **kwargs):
    """Calls a function with exponential backoff retry for 429 errors.
    
    Args:
        func: The callable to execute.
        *args: Positional arguments for the callable.
        **kwargs: Keyword arguments for the callable.
    """
    max_retries = 5
    base_delay = 2
    
    for i in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            # Check for 429 or RESOURCE_EXHAUSTED in error message
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                delay = base_delay * (2 ** i)
                print(f"[Warning] Rate limit hit (429). Retrying in {delay} seconds... (Attempt {i+1}/{max_retries})")
                time.sleep(delay)
            else:
                # Re-raise other exceptions immediately
                raise e
                
    raise Exception("Max retries reached for API call due to rate limits (429).")
