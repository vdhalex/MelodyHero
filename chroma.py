from __future__ import print_function
import librosa, numpy as np, scipy as sp
import vamp

def find_nearest(array, value):
  array = np.asarray(array)
  idx = (np.abs(array - value)).argmin()
  return array[idx]

def get_frequencies():
  audio, sr = librosa.load('piano.wav', sr=None)
  data = vamp.collect(audio, sr, "mtg-melodia:melodia")
  hop, melody = data['vector']
  timestamps = 8 * 128/sr + np.arange(len(melody)) * (128/sr)

  onsets = librosa.onset.onset_detect(audio, sr, units='time')
  freqs = []
  temp_time = timestamps.tolist()

  for i in onsets:
      time_val = find_nearest(timestamps, i)
      time_index = timestamps.tolist().index(time_val)
      freqs.append(melody[time_index])

  print(freqs)
  print(onsets)

  return freqs, onsets
