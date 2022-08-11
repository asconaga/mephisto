#pragma once

class CDownloadRequest;

class CRequestResult {
public:

	CRequestResult(int id, int status)
	{
		m_id = id;
		m_status = status;
	}

	int m_id;
	int m_status;
	CString m_data;
};

class CThogClientThread : public CWinThread
{
	DECLARE_DYNCREATE(CThogClientThread)

public:
	CThogClientThread(CWnd* pParent = nullptr);           // protected constructor used by dynamic creation
	virtual ~CThogClientThread();
	DWORD CompleteRequest(CDownloadRequest* pRequest, CRequestResult* pResponse);
	DWORD OpenRequest(CDownloadRequest* pRequest);
	void AddDownloadRequest(CDownloadRequest* pRequest);
	CDownloadRequest* PopRequest(void);

	CRequestResult* GetRequestData(int id);
public:
	bool m_bRunning;
	CWnd* m_pParent;

	CMap<int, int, CRequestResult*, CRequestResult*> m_msgArr;

	CTypedPtrArray<CPtrArray, CDownloadRequest*> m_requestQueue;
	CCriticalSection m_queueSection;

protected:
	CStdioFile* m_pInputFile;
	CInternetConnection* m_pInternetConnection;
	CInternetSession* m_pInternetSession;

	int m_totalBytesRcvd;
	int m_status;
	int m_nRequests;

public:
	virtual BOOL InitInstance();
	virtual int ExitInstance();

protected:
	DECLARE_MESSAGE_MAP()
public:
	virtual int Run();
};


