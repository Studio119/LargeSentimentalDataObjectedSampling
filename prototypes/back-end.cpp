#include <iostream>
#include <stdlib.h>


int main(int argc, char** argv) {
	std::cout << "Starting back-end server..." << std::endl;
	std::string cmd = "";
	system("cd app && node server.js");
	
	do {
		std::cin >> cmd;
	} while (true);
	
    return 0;
}

