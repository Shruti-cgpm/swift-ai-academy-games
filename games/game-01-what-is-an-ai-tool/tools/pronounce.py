"""Spoken forms for the voice only (screen text is not changed). Add more abbreviations here."""
import re
SAY = {
    'ITI': 'I T I',
    'HOD': 'H O D',
}
def spoken(text):
    for k, v in SAY.items():
        text = re.sub(r'\b' + re.escape(k) + r'\b', v, text)
    return text
