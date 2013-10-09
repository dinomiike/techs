/*
 * Print a number (n) of fibonacci numbers in a list
 * To run from the command line, type: groovy fib.groovy 5
 */

def fib(n) {
    def index = 2
    def list = [0,1]
    if (n == 1) {
        println list[n]
    } else if (n == 2) {
        println list
    } else {
    	while (index < n) {
        	list.push(list[index - 1] + list[index - 2])
        	index += 1
    	}
    	println list
    }
}

for (a in this.args) {
	fib(a.toInteger())
}

