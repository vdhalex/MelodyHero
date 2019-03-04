import librosa
import numpy as np

if __name__ == '__main__':
  signal, sr = librosa.load("trumpet.wav", sr=None)
  print(sr)