# MelodyHero
EECS 352: Machine Perception of Music and Audio final project.
=======
To run this project, you will need to have the librosa and numpy libraries installed on your machine.

Here are instructions for downloading the project and getting it running.

Note: We use Justin Salamon's pitch tracker Melodia to track pitch in our audio files, links on how to get that set up are here https://github.com/justinsalamon/melodia_python_tutorial/blob/master/melodia_python_tutorial.ipynb

```
cd ~/path/to/directory
git clone https://github.com/vdhalex/MelodyHero.git
cd MelodyHero
pip install librosa vamp numpy
npm install
node main.js
```
Then just nagivate to localhost:3000 on your browser, upload your .wav file, and enjoy!

References:

J. Salamon and E. Gomez, "Melody Extraction from Polyphonic Music Signals using Pitch Contour Characteristics", IEEE Transactions on Audio, Speech and Language Processing, 20(6):1759-1770, Aug. 2012.
