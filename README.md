# HW-Web-Programming

This github is for the development of an MMOG for the Computer Systems Web Programming course at Heriot-Watt, second year. We are to create this game using Javascript, HTML and CSS, using the likes of Node to handle the player connections. Sexurity is of course also a concern.

V0.3

As the course progressed, we realised our planned game was a bit too amibitious for our current abilities.

We thus have switched to an easier format, first trying a flappy bird like game, before settling on a spaceship game. You fly around a small ship that collects stars, each of which add to your teams overall score.n This is a team game, with players allocated to red or blue, and after a set score is met or time has passed, the game will end, and the team with the more stars collected wins.

For ease of view, the player will see other players as a different type of sprite, to make following their own ship easier. The game also features live chat, with nicknames for the player.

V0.2

After discussions, the design for the game has changed to focus on a more active design. Instead of a text adventure, players will join a lobby, followed by 3 or 5 of them splitting off into groups to traverse some topdown dungeons. These dungeons will be a series of rooms cleared through tasks such as puzzles (press allbuttons at the same time) or kiling all enemies. At certain intervals, there will also be rooms were a decision must be made, such as go left or go right. The players must vote, through a simple system of standing in a coloured area, which will then open the door to the route they have chosen.

Each route will have its own rooms, with different puzzles or enemies, and a different boss at the end.

For later versions of the game, this could be expanded, to have dungeons with more and more splits as you progress, perhaps using some form of random generation and modifiers,but for the initial version we will be sticking to a simple, binary choice part way through.

V0.1

For this game, we will be creating a Choose your own adventure, similar in nature to the old fighting fantasy books.

For this game specifically, we will have the text broken up into brief burbs, followed by 1-4 of options. Everyone in the lobby will be able to select one of the options presented (go left, go right, pet dog, etc) to advance the adventure. The most voted for option will then occur ("You take the time to pet the dog. the dog yaps exicted and starts to dig at the ground, uncovering a huge bag of gold!") To help prevent the game stalling, a timer will end the vote after a specific amount of time. In the case of a tie, a coin toss will occur to keep the game flowing.

The game will have basic 2d graphics to represent the current location, events and other such information that can be visually shown. An inventory list is a possible addition, but for the base release we will be focusing on getting the voting system to work to allow players to get through the adventure. Or die horribly due to poor decisions.

This will mostly function through the use of Node.js, with HTML and CSS used to present the text and visuals.
