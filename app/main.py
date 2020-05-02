from operator import itemgetter
from os import path
from pathlib import Path
from subprocess import run
from tkinter import (HORIZONTAL, VERTICAL, Canvas, E, N, S, Tk, Toplevel, W,
                     filedialog, messagebox, ttk)

from tinydb import TinyDB, where

from logic.machine_learning import (build_X, init_groups, modify_groups,
                                    review_groups, tag_groups)
from logic.timbral_models import (process_freesound_samples, process_sounds,
                                  timbral_characterstics)

# Database setup
db = TinyDB("db.json")
ml = TinyDB("ml.json")


def update_databases(sounds, centroids, X=None):
  """Updates databases with modified data."""
  for sound in sounds:
    db.upsert(sound, where("id") == sound["id"])

  ml.upsert({"data": centroids, "id": "centroids"},
            where("id") == "centroids")
  if X:
    ml.upsert({"data": X, "id": "X"}, where("id") == "X")


def purge_databases():
  """Clears all data from the databases."""
  if not len(db.all()):
    messagebox.showerror(message="There are no sounds to delete!")
    return

  ok = messagebox.askokcancel(
      message="This will remove all currently added sounds.")

  if ok:
    db.purge()
    ml.purge()
    draw_table()


def check_database_occurrence(sounds):
  """Checks if new sounds are already in the database."""
  new_sounds = []

  for sound in sounds:
    db_sound = db.search(where("id") == sound["id"])
    if not db_sound:
      new_sounds.append(sound)

  return new_sounds


def choose_directory(mode=None):
  """Loads files from a directory and handles them appropriately."""
  directory = filedialog.askdirectory(initialdir=Path.cwd())
  if not directory:
    return

  if mode == "freesound":
    sounds = process_freesound_samples(directory)
    if not sounds:
      messagebox.showerror(
          message=("No valid metadata files (.json) " +
                   "found in chosen directory!"))
      return
  else:
    sounds = process_sounds(directory)
    if not sounds:
      messagebox.showerror(
          message=("No supported sound files (.wav) " +
                   "found in chosen directory!"))
      return

  # Checks if chosen sounds already exist in the database.
  sounds = check_database_occurrence(sounds)
  if not sounds:
    messagebox.showerror(
        message="No new sounds to analyze found in chosen directory!")
    return

  # Finds initial groups for all sounds.
  sounds += db.all()
  X = build_X(sounds)
  sounds, centroids = init_groups(sounds, X)

  # Checks that all groups has a single unique tag and
  # makes sure new sounds are tagged according to the group they belong to.
  sounds, X, centroids = review_groups(sounds, X, centroids)
  sounds, X = tag_groups(sounds)

  update_databases(sounds, centroids, X)
  draw_table()


def tag(dialog, input, sound):
  """Tags a sound, plus potentially related sounds."""
  errorMessage = None

  if not input or input.isspace():
    errorMessage = "Input cannot be empty!"
  elif input == sound["tag"]:
    errorMessage = "The input cannot be the same as the current value!"

  if errorMessage:
    messagebox.showerror(message=errorMessage)
    return

  # Keep current groupings.
  group_sounds = db.search(where("group") == sound["group"])
  if (sound["verified"] or all([not gs["verified"] for gs in group_sounds])):
    db.update({"tag": input}, where("group") == sound["group"])
    db.update({"verified": True}, where("id") == sound["id"])
  else:  # Modify groups.
    db.update(
        {"tag": input, "verified": True},
        where("id") == sound["id"]
    )
    modified_sound = db.search(where("id") == sound["id"])[0]

    db_sounds = db.all()
    X = ml.search(where("id") == "X")[0]["data"]
    centroids = ml.search(where("id") == "centroids")[0]["data"]

    sounds, centroids = modify_groups(
        db_sounds,
        X,
        centroids,
        modified_sound,
        input,
        db_sounds
    )
    sounds, X, centroids = review_groups(sounds, X, centroids)
    sounds, X = tag_groups(sounds)
    update_databases(sounds, centroids, X)

  draw_table()
  dialog.destroy()


def tag_dialog(sound):
  """Dialog to enter tag input."""
  dialog = Toplevel()
  dialog.title("Tag")

  frame = ttk.Frame(dialog)
  frame.grid(column=0, row=0, sticky=(N, W, E, S))

  input = ttk.Entry(frame)
  input.grid(column=0, row=0)
  input.focus()

  button = ttk.Button(frame, text="Tag", command=lambda dialog=dialog,
                      input=input: tag(dialog, input.get().strip(), sound))
  button.grid(column=0, row=1)


def verify(sound):
  """Toggles verification of a sound."""
  db.update({"verified": not sound["verified"]}, where("id") == sound["id"])
  draw_table()


def listen(event, sound):
  """Opens a sound in the system default application."""
  sound_path = f"{path.splitext(sound['path'])[0]}.{sound['type']}"
  run(["open", sound_path])


def draw_table():
  """(Re)draws the table of sounds."""
  lower_frame = ttk.Frame(main_frame)
  lower_frame.grid(column=0, row=2, sticky=(N, E, S, W))
  lower_frame.columnconfigure(0, weight=1)
  lower_frame.rowconfigure(1, weight=1)

  # Info
  info_frame = ttk.Frame(lower_frame, padding=(0, 0, 0, 10))
  info_frame.grid(column=0, row=0, sticky=(N, E, S, W))
  info_frame.columnconfigure(0, weight=1)
  info_frame.columnconfigure(1, weight=1)
  info_frame.columnconfigure(2, weight=1)

  sounds = db.all()
  label = ttk.Label(info_frame, text=f"Number of sounds: {len(sounds)}")
  label.grid(column=0, row=0)

  try:
    centroids = ml.search(where("id") == "centroids")[0]["data"]
  except:
    centroids = []
  label = ttk.Label(
      info_frame, text=f"Number of groups: {len(centroids)}")
  label.grid(column=1, row=0)

  button = ttk.Button(info_frame, command=purge_databases,
                      text="Delete sounds")
  button.grid(column=2, row=0)

  # Scrollbars
  canvas = Canvas(lower_frame, bg="#e6e6e6", highlightthickness=0)
  canvas.grid(column=0, row=1, sticky=(N, E, S, W))

  scrollbar_y = ttk.Scrollbar(
      lower_frame, orient=VERTICAL, command=canvas.yview, bg="#e6e6e6")
  scrollbar_y.grid(column=1, row=1, sticky=(N, E, S, W))

  scrollbar_x = ttk.Scrollbar(
      lower_frame, orient=HORIZONTAL, command=canvas.xview, bg="#e6e6e6")
  scrollbar_x.grid(column=0, row=2, sticky=(N, E, S, W))

  scrollable_frame = ttk.Frame(canvas, padding=(10, 0))
  scrollable_frame.bind("<Configure>", lambda e: canvas.configure(
      scrollregion=canvas.bbox("all")))

  canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
  canvas.configure(yscrollcommand=scrollbar_y.set)
  canvas.configure(xscrollcommand=scrollbar_x.set)

  # Table
  fields = ["name", "type", "group", "tag",
            "verified", "pack_name"] + timbral_characterstics
  sounds = db.all()
  sounds.sort(key=itemgetter("pack_name", "name", "id"))

  for row, sound in enumerate(sounds, start=1):
    # Headers
    if row == 1:
      for column, field in enumerate(fields, start=2):
        label = ttk.Label(scrollable_frame,
                          font="-weight bold", text=field)
        label.grid(column=column, row=0)
        scrollable_frame.columnconfigure(column, weight=1)

    button = ttk.Button(scrollable_frame, command=lambda sound=sound:
                        tag_dialog(sound), text="Tag")
    button.grid(column=0, row=row)

    if sound["tag"]:
      if sound["verified"]:
        text = "Unverify"
      else:
        text = "Verify"
      button = ttk.Button(scrollable_frame, command=lambda sound=sound:
                          verify(sound), text=text)
      button.grid(column=1, row=row)

    for column, field in enumerate(fields, start=2):
      label = ttk.Label(scrollable_frame)
      value = sound[field]

      if value == "":
        value = "-"
      elif isinstance(value, bool):
        if sound["tag"]:
          if value:
            value = "Yes"
            label.configure(foreground="green")
          else:
            value = "No"
            label.configure(foreground="red")
        else:
          value = "-"
      elif isinstance(value, float):
        value = round(value, 2)

      label.configure(text=value)
      label.grid(column=column, row=row)

      if field == "name":
        label.bind("<Button-1>", lambda event,
                   sound=sound: listen(event, sound))
        label.configure(cursor="hand2", foreground="blue")

  # Removes old render.
  if len(main_frame.grid_slaves()) > 3:
    main_frame.grid_slaves()[1].destroy()

  root.update()
  if(scrollable_frame.winfo_width() < canvas.winfo_width()):
    canvas.itemconfig(1, width=canvas.winfo_width())


# Root
root = Tk()
root.title("Subjective Audio Tagging")
root.grid_columnconfigure(0, weight=1)
root.grid_rowconfigure(0, weight=1)
root.geometry(f"{root.winfo_screenwidth()}x{root.winfo_screenheight()}")

# Main frame
main_frame = ttk.Frame(root)
main_frame.grid(column=0, row=0, sticky=(N, E, S, W))
main_frame.grid_columnconfigure(0, weight=1)
main_frame.grid_rowconfigure(2, weight=1)

# Lower frame
upper_frame = ttk.Frame(main_frame, padding=10)
upper_frame.grid(column=0, row=0, sticky=(N, E, S, W))
upper_frame.columnconfigure(0, weight=1)
upper_frame.columnconfigure(1, weight=1)

label = ttk.Label(upper_frame, text="Add sounds")
label.grid(column=0, row=0)

button = ttk.Button(upper_frame, command=choose_directory,
                    text="Choose directory")
button.grid(column=0, row=1)

label = ttk.Label(upper_frame, text="Add Freesound samples")
label.grid(column=1, row=0)

button = ttk.Button(upper_frame, command=lambda mode="freesound":
                    choose_directory(mode), text="Choose directory")
button.grid(column=1, row=1)

# Middle frame
middle_frame = ttk.Frame(main_frame, padding=10)
middle_frame.grid(column=0, row=1, sticky=(N, E, S, W))
middle_frame.columnconfigure(0, weigh=1)

separator = ttk.Separator(middle_frame)
separator.grid(column=0, row=0, sticky=(N, E, S, W))

# Lower frame
draw_table()

# Enter event loop
root.mainloop()
