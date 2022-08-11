#pragma once
class CDownloadRequest
{
public:
	CDownloadRequest(void);
	~CDownloadRequest(void);

public:
	CString m_url;
	CString m_payload;

	int m_nVerb;
};

