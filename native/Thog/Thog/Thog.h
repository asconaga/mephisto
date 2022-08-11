
// MALClient.h : main header file for the PROJECT_NAME application
//

#pragma once

#ifndef __AFXWIN_H__
	#error "include 'stdafx.h' before including this file for PCH"
#endif

#include "resource.h"		// main symbols


// CMALClientApp:
// See MALClient.cpp for the implementation of this class
//

class CMALClientApp : public CWinApp
{
public:
	CMALClientApp();

// Overrides
public:
	virtual BOOL InitInstance();

// Implementation

	DECLARE_MESSAGE_MAP()
};

extern CMALClientApp theApp;