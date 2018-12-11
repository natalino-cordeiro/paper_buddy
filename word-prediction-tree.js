class PrefixTreeNode {
    constructor(value) {
        this.children = {};
        this.endWord = false;
        this.endWordCount = 0;
        this.value = value;
    }
}

class WordCount {
    constructor(str, n) {
        this.word = str;
        this.count = n;
    }
}

class PrefixTree extends PrefixTreeNode {
    constructor() {
        super(null);
    }

    addWord(str) {
        var node = this;

        console.log(str);
        for (var i = 0; i < str.length; i++) {
            
            //create the node if it doesn't exist already
            if (!node.children[str[i]]) {
                node.children[str[i]] = new PrefixTreeNode(str[i]);
            }

            // signal end of word or move on
            if (str.length === i + 1) {
                node.children[str[i]].endWord = true;
                node.children[str[i]].endWordCount++;
            }
            else if (str[i + 1] === " ") {
                    node.children[str[i]].endWord = true;
                    node.children[str[i]].endWordCount++;
                }

            // set the 'current' node
            node = node.children[str[i]];
        }
    }

    predictWord(string) {
        var getRemainingTree = function (string, tree) {
            var node = tree;
            while (string) {
                node = node.children[string[0]];
                string = string.substr(1);
            }
            return node;
        };

        var allWords = [];

        var allWordsHelper = function (stringSoFar, tree) {
            for (let k in tree.children) {
                const child = tree.children[k];
                var newString = stringSoFar + child.value;
                if (child.endWord) {
                    allWords.push(new WordCount(newString, child.endWordCount));
                }
                allWordsHelper(newString, child);
            }
        };

        var remainingTree = getRemainingTree(string, this);
        if (remainingTree) {
            allWordsHelper(string, remainingTree);
        }

        return allWords;
    }

    logAllWords() {
        console.log('------ ALL WORDS IN PREFIX TREE -----------');
        console.log(this.predictWord(''));
    }
}



module.exports = {
    PrefixTree: PrefixTree
};