from __future__ import print_function
import librosa, vamp, numpy as np, sys

def find_nearest(array, value):
  array = np.asarray(array)
  idx = (np.abs(array - value)).argmin()
  return array[idx]

def get_frequencies(path):
  audio, sr = librosa.load(path, sr=None)
  data = vamp.collect(audio, sr, "mtg-melodia:melodia")
  hop, melody = data['vector']
  timestamps = 8 * 128/sr + np.arange(len(melody)) * (128/sr)

  onsets = librosa.onset.onset_detect(audio, sr, units='time')
  freqs = []

  for i in onsets:
      time_val = find_nearest(timestamps, i)
      time_index = timestamps.tolist().index(time_val)
      freqs.append(melody[time_index])

  return freqs, onsets

if __name__ == "__main__":
  x = str(sys.argv[1])
  freqs, onsets = get_frequencies(x)
  print(len(freqs))
  for i in freqs:
    print(i)
  for j in onsets:
    print(j)
