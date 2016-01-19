/**
 * Created by prateek on 6/12/15.
 */
var statesOfX = {};
//table status
statesOfX.tableStatus 									= {};
statesOfX.tableStatus.waiting 					= "WAITING";
statesOfX.tableStatus.cardToBeDistrib 	= "CARDTOBEDISTRIB";
statesOfX.tableStatus.gameIsOn 					= "GAMEISON";

//player moves
statesOfX.playerMoves 							= {};
statesOfX.playerMoves.chaal 				= "CHAAL";
statesOfX.playerMoves.sideShowChaal = "SIDESHOWCHAAL"
statesOfX.playerMoves.pack 					= "PACK";
statesOfX.playerMoves.blind 				= "BLIND";
statesOfX.playerMoves.show 					= "SHOW";

//state of gamewhich is going on server
statesOfX.gameType 						= {};
statesOfX.gameType.normal 		= "NORMAL";
statesOfX.gameType.twoCards 	= "TWOCARDS";
statesOfX.gameType.fourCards 	= "FOURCARDS";
statesOfX.gameType.muflish 		= "MUFLISH";

//
statesOfX.playerState 						= {}
statesOfX.playerState.blind 			= "BLIND";
statesOfX.playerState.packed 			=	"PACKED";
statesOfX.playerState.chaal 			= "CHAAL";
statesOfX.playerState.waiting 		= "WAITING";
statesOfX.playerState.outOfMoney 	= "OUTOFMONEY";

statesOfX.gameEndingType 										= {};
statesOfX.gameEndingType.gameComplete 			= "GAME_COMPLETED";
statesOfX.gameEndingType.everybodyPacked 		= "EVERYBODY_PACKED";
statesOfX.gameEndingType.onlyOnePlayerLeft 	= "ONLY_ONE_PLAYER_LEFT";

statesOfX.visualDealer 					= {};
statesOfX.visualDealer.dealer1 	= "dealer:1";
statesOfX.visualDealer.dealer2 	= "dealer:2";


module.exports = statesOfX;