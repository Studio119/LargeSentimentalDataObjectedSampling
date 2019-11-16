#include <iostream>
#include <stdlib.h>


int main(int argc, char** argv) {
    std::cout << "Starting front-end server..." << std::endl;
	std::string cmd = "";
	system("cd app && npm start");
    
	do {
		std::cin >> cmd;
	} while (true);
	
    return 0;
}

