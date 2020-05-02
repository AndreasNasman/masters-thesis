# Personalized sound profiling using machine learning

## Use case

1. The user installs the standalone program.
2. When the program is started for the first time it prompts the user for audio files to analyze.
3. Once some sounds have been selected and loaded they are profiled by Essentia, Audio Commons (or similar).
   - The profiling can be batched to improve performance.
4. After some audio files have been selected and loaded, it's possible to listen to the sounds and start labelling them.
   - Some form of predefined list should be generated for the user to choose labels from.
   - The labels should maybe be restricted per sound category, i.e. all labels should not necessarily be available to all form of sounds.
   - The labels should be saved on the sound itself if possible, otherwise separately.
5. After at least one sound has been labelled, the machine learning algorithm kicks in and, consequently, suggested labels starts appearing to the user upon labelling of the next sound.
   - The machine learning should improve over iterations and corrections given to it by the user (semi-supervised learning).
