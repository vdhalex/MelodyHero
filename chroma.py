from __future__ import print_function
import librosa, vamp, numpy as np, sys

def find_nearest(array, value):
    """
    Takes an array and value and returns value in array closes to the desired value.
    
    Input Parameters
    ----------------
    array: a 1-D array from which you want to find the closest value in.
        
    value: value that you want to find the closest element value in the array.
        
    Returns
    -------
    value of element in array closest to value given
    """
  array = np.asarray(array)
  idx = (np.abs(array - value)).argmin()
  return array[idx]

def get_frequencies(path):
      """
    Takes a path to a .wav audio file from which to load audio and sr. From this, tracks pitch of audio
    and computes onsets. Will then return onsets and respective frequencies at each time value in onsets
    
    Input Parameters
    ----------------
    path: Path to .wav file to be loaded in as audio.
        
    Returns
    -------
    freqs: a 1-d numpy array of frequencies of each time t in onsets from audio in path.

    onsets: a 1-d numpy array of onset times (in seconds) from audio in path.
    """
    
  # Load desired audio
  audio, sr = librosa.load(path, sr=None)

  # Run Melodia on audio to track pitches of melody and get output array of frequencies
  data = vamp.collect(audio, sr, "mtg-melodia:melodia")
  hop, melody = data['vector']

  # Setting all negative values in melody to None
  melody_pos = melody[:]
  melody_pos[melody<=0] = None

  # Get onsets of tracks
  onsets = librosa.onset.onset_detect(audio, sr, units='time')

  # Get frequencies at each time given by onsets array
  # If value at onsets is None, remove value from onset array
  # Using RMS, evaluate energy at onset to ensure onset detection accurary -- TO BE IMPLEMENTED
  freqs = []
  for i in onsets:
    time_val = find_nearest(timestamps, i)
    time_index = timestamps.tolist().index(time_val)
    curr_mel = melody_pos[time_index]
    if curr_mel == None:
      onsets.pop(i)
      continue
    freqs.append(melody_pos[time_index])

  # Return onsets and respective frequencies
  return freqs, onsets

if __name__ == "__main__":

  # Read argument (filepath) passed into our script from main.js and store it in x
  x = str(sys.argv[1])
  freqs, onsets = get_frequencies(x)

  # Print statements send messages back to Node in array, hence this sends relevant information to our JS
  # to then be parsed
  print(len(freqs))
  for i in freqs:
    print(i)
  for j in onsets:
    print(j)
