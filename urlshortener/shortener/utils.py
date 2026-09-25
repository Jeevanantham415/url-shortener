CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode_base62(number):
    result = []
    if number == 0:
        return "0"
    while number>0:
        remainder = number % 62 
        result.append(CHARACTERS[remainder])
        number = number //62

    result.reverse()
    short_code = ''.join(result)
    return short_code

    