datapath <- "/OU/RAGE/Portal/WP1 Methodological alignment/Architecture/monogame/data/"

aiVect <- c("Very Easy AI", "Easy AI", "Medium Shape AI", "Medium Color AI", "Hard AI", "Very Hard AI")


plotRatings <- function(){
	monoDF = read.table(paste0(datapath, "gameplay_monogame.txt"), stringsAsFactors=FALSE, header=TRUE)
	newDF = read.table(paste0(datapath, "gameplay_js_new.txt"), stringsAsFactors=FALSE, header=TRUE)
	controlDF = read.table(paste0(datapath, "gameplay_js_control.txt"), stringsAsFactors=FALSE, header=TRUE)

	print(nrow(controlDF))

	plot(monoDF$PlayerRating, type="b", col="black", lwd=10, pch=1, ylim=c(0, 1.8)
		, xlab="Game matches", ylab="Player's expertise ratings"
		, main="Player ratings in Monogame and Cocos2D-JS simulations")
	lines(controlDF$PlayerRating, type="b", col="gray", lwd=2, pch=2)
	lines(newDF$PlayerRating, type="b", col="blue", lwd=2, pch=3)

	legend("topleft", pch=1:3, col=c("black", "gray", "blue"), lwd=2
		, legend=c("Monogame", "Cocos2D-JS control", "Cocos2D-JS new"))
}

plotRatings()