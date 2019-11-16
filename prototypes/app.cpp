#include <iostream>
#include <Windows.h>
using namespace std;

void startBackEndServer();
void startFrontEndServer();

int main() {  
    startBackEndServer();
    startFrontEndServer();
    
    Sleep(100);
    
    return 0;
}

void startBackEndServer() {
	char cWindowsDirectory[MAX_PATH];
    LPTSTR cWinDir = new TCHAR[MAX_PATH];
    GetCurrentDirectory(MAX_PATH, cWinDir);
    
	string path = cWinDir;
	path = path + "\\app\\back-end.exe";
    LPTSTR sConLin = TEXT((LPSTR)(LPCSTR)path.c_str());

    STARTUPINFO si;
    PROCESS_INFORMATION pi;
    
    ZeroMemory(&si, sizeof(si));
    ZeroMemory(&pi, sizeof(pi));
    
    if (CreateProcess(
		        NULL,
		        sConLin,
		        NULL,
		        NULL,
		        false,
		        0,
		        NULL,
		        NULL,
		        &si,
		        &pi
	        )
		) {
		CloseHandle(pi.hProcess);
    	CloseHandle(pi.hThread);
    }
    else {
        cerr << "failed to create process" << endl;
    }
}

void startFrontEndServer() {
	char cWindowsDirectory[MAX_PATH];
    LPTSTR cWinDir = new TCHAR[MAX_PATH];
    GetCurrentDirectory(MAX_PATH, cWinDir);
    
	string path = cWinDir;
	path = path + "\\app\\front-end.exe";
    LPTSTR sConLin = TEXT((LPSTR)(LPCSTR)path.c_str());

    STARTUPINFO si;
    PROCESS_INFORMATION pi;
    
    ZeroMemory(&si, sizeof(si));
    ZeroMemory(&pi, sizeof(pi));
    
    if (CreateProcess(
		        NULL,
		        sConLin,
		        NULL,
		        NULL,
		        false,
		        0,
		        NULL,
		        NULL,
		        &si,
		        &pi
	        )
		) {
		CloseHandle(pi.hProcess);
    	CloseHandle(pi.hThread);
    }
    else {
        cerr << "failed to create process" << endl;
    }
}

