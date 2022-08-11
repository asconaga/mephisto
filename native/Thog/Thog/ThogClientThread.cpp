#include "stdafx.h"
#include "thog.h"
#include "thogCLientThread.h"
#include "DownloadRequest.h"

// CThogClientThread

IMPLEMENT_DYNCREATE(CThogClientThread, CWinThread)

CThogClientThread::CThogClientThread(CWnd* pParent)
{
	m_bRunning = false;

	m_pParent = pParent;

	m_pInputFile = nullptr;
	m_pInternetConnection = nullptr;
	m_pInternetSession = nullptr;
	m_nRequests = 0;
}

CThogClientThread::~CThogClientThread()
{
	// iterate map
	int index;
	CRequestResult* pMyClass = nullptr;

	for (POSITION Pos = m_msgArr.GetStartPosition(); Pos != nullptr; )
	{
		m_msgArr.GetNextAssoc(Pos, index, pMyClass);

		delete pMyClass;
	}
}

BOOL CThogClientThread::InitInstance()
{
	m_bRunning = true;
	m_bAutoDelete = false; // don't automatically delete this thread

	return TRUE;
}

int CThogClientThread::ExitInstance()
{
	return CWinThread::ExitInstance();
}

BEGIN_MESSAGE_MAP(CThogClientThread, CWinThread)
END_MESSAGE_MAP()

// CThogClientThread message handlers

int CThogClientThread::Run()
{
	while (m_bRunning)
	{
		CDownloadRequest* pRequest = PopRequest();

		if (pRequest != nullptr)
		{
			int nRet = OpenRequest(pRequest);

			if (nRet > 0) // valid request should potentially be 200
			{
				CRequestResult* pResult = new CRequestResult(m_nRequests++, nRet);

				m_msgArr[pResult->m_id] = pResult;

				CompleteRequest(pRequest, pResult);
			}

			delete pRequest;
		}
		else
		{
			Sleep(100);
		}
	}

	return 0;
}

void CThogClientThread::AddDownloadRequest(CDownloadRequest* pRequest)
{
	CSingleLock lock(&m_queueSection);
	if (lock.Lock())
	{
		m_requestQueue.Add(pRequest);

		lock.Unlock();
	}
}

CDownloadRequest* CThogClientThread::PopRequest(void)
{
	CDownloadRequest* pHead = nullptr;

	CSingleLock lock(&m_queueSection);
	if (lock.Lock())
	{
		if (m_requestQueue.GetSize() > 0)
		{
			pHead = m_requestQueue[0];
			m_requestQueue.RemoveAt(0);
		}

		lock.Unlock();
	}

	return pHead;
}

CRequestResult* CThogClientThread::GetRequestData(int id)
{
	return m_msgArr[id];
}

DWORD CThogClientThread::CompleteRequest(CDownloadRequest* pRequest, CRequestResult* pResponse)
{
	int nRet = 0;
	if ((m_pInternetConnection != nullptr) && (m_pInputFile != nullptr))
	{
		CString msg = "";

		CString x;
		UINT nChars;
		char buff[513];
		do
		{
			try
			{
				nChars = m_pInputFile->Read(buff, 512);
			}
			catch (CInternetException* pe)
			{
				nChars = 0;
				pe->Delete();
			}
			if (nChars > 0)
			{
				buff[nChars] = 0;
			}
			msg += buff;
			m_totalBytesRcvd += nChars;
		} while (nChars > 0);

		msg.SetAt(m_totalBytesRcvd, 0);

		pResponse->m_data = msg;

		m_pInputFile->Close();
		delete m_pInputFile; m_pInputFile = nullptr;

		m_status = 2;

		if (m_pInternetConnection)
		{
			delete m_pInternetConnection; m_pInternetConnection = nullptr;
		}

		m_pInternetSession->Close(); delete m_pInternetSession; m_pInternetSession = nullptr;
		m_status = 3;	
		
		m_pParent->PostMessage(WM_MSG, pResponse->m_id, 0);
	}

	return nRet;
}

DWORD CThogClientThread::OpenRequest(CDownloadRequest* pRequest)
{
	DWORD nRet = -100; // currently processing a request

	if (m_pInternetConnection == nullptr)
	{
		m_status = 0;
		m_totalBytesRcvd = 0;

		nRet = 0; // we are processing this 

		CString strServerName;
		CString strObject;
		unsigned short nNewPort;
		DWORD dwServiceType;

		if (AfxParseURL(pRequest->m_url, dwServiceType, strServerName, strObject, nNewPort))
		{
			m_pInternetSession = new CInternetSession();

			// set any CInternetSession options we  may need
			int ntimeOut = 300;
			m_pInternetSession->SetOption(INTERNET_OPTION_CONNECT_TIMEOUT, 1000 * ntimeOut);
			m_pInternetSession->SetOption(INTERNET_OPTION_RECEIVE_TIMEOUT, 0);
			m_pInternetSession->SetOption(INTERNET_OPTION_CONNECT_BACKOFF, 1000);
			m_pInternetSession->SetOption(INTERNET_OPTION_CONNECT_RETRIES, 1);

			if (dwServiceType == AFX_INET_SERVICE_HTTP)
			{
				// just handle HTTP (for now)

				CHttpFile* pHttpFile = nullptr;

				DWORD HttpRequestFlags = INTERNET_FLAG_EXISTING_CONNECT | INTERNET_FLAG_RELOAD | INTERNET_FLAG_DONT_CACHE;

				CHttpConnection* pHttpConnect = m_pInternetSession->GetHttpConnection(strServerName, HttpRequestFlags, nNewPort);

				pHttpFile = pHttpConnect->OpenRequest(pRequest->m_nVerb, strObject,
					NULL, 1, NULL, NULL, HttpRequestFlags);

			  // Use direct write to posting field!
				CString strHeaders = "Accept: text/*\r\n";
				strHeaders += "User-Agent: MALClient\r\n";
				strHeaders += "Accept-Language: en-us\r\n";

				strHeaders += "Content-type: application/json\r\n";
				//    strHeaders += "REMOTE_USER: "+strUser+"\r\n";

				pHttpFile->AddRequestHeaders((LPCSTR)strHeaders);

				clock_t start_t = clock();

				bool bContinue = true;
				try
				{
					if (pRequest->m_nVerb == CHttpConnection::HTTP_VERB_GET) 
					{
						pHttpFile->SendRequest();
					}
					else
					{
						int postLen = pRequest->m_payload.GetLength();
						pHttpFile->SendRequestEx(postLen, HSR_INITIATE, 1);
						pHttpFile->WriteString((LPCTSTR)pRequest->m_payload);
						pHttpFile->EndRequest();
					}
				}
				catch (CInternetException* e)
				{
					clock_t end_t = clock();

					double total_t = (end_t - start_t) / (double)CLOCKS_PER_SEC;

					e->ReportError(); //  YAKUBU: send message to listbox
					e->Delete();

					bContinue = false;
				}

				if (bContinue)
				{
					pHttpFile->QueryInfoStatusCode(nRet); // check wininet.h for info about the status code
			
					DWORD fileSize;
					if (!pHttpFile->QueryInfo(HTTP_QUERY_CONTENT_LENGTH, fileSize))
					{
						fileSize = 0;
					}

					CString headers;
					pHttpFile->QueryInfo(HTTP_QUERY_RAW_HEADERS_CRLF, headers);

					m_pInputFile = pHttpFile;
					m_pInternetConnection = pHttpConnect;
				}
				else
				{
					delete pHttpConnect; 
					delete m_pInternetSession; 	m_pInternetSession = nullptr;
					delete pHttpFile;
				}
			}
			else
			{
				delete m_pInternetSession; 	m_pInternetSession = nullptr;
			}
		}
		else
		{
			nRet = -1; // invalid url
		}
	}

	return nRet;
}
