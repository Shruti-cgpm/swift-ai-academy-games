"""Spoken forms for the voice only (screen text is not changed). Add more abbreviations here."""
import re
SAY = {
    'ITI': 'I T I',
    'HOD': 'H O D',
    'ID': 'I D',
    'IDs': 'I Ds',
    'PC': 'P C',
    'NSQF': 'N S Q F',
    'UNT': 'U N T',
    'NRIC': 'N R I C',
    'CERT-In': 'Cert In',
    'SPN': 'S P N',
    'FRLS': 'F R L S',
    'ISI': 'I S I',
    'RCCB': 'R C C B',
    'MCB': 'M C B',
    'NSS': 'N S S',
}
def spoken(text):
    for k, v in SAY.items():
        text = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w-])', v, text)
    text = re.sub(r'\bsq\.? ?mm\b', 'square millimetre', text)
    text = re.sub(r'(\d)\s?V\b', r'\1 volt', text)
    text = re.sub(r'(\d)\s*[–-]\s*(\d)', r'\1 to \2', text)      # 0:15–0:45 -> 0:15 to 0:45
    text = re.sub(r'_{2,}', 'blank', text)                        # "I think ___ because ___"
    text = text.replace('[', '').replace(']', '')                 # [brackets] are read as the word
    text = text.replace('…', '.').replace(' · ', ', ')
    return text
