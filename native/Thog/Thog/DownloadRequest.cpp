#include "stdafx.h"
#include "DownloadRequest.h"

CDownloadRequest::CDownloadRequest(void)
{
	m_url = "";
	m_nVerb = CHttpConnection::HTTP_VERB_GET;
	m_payload = "";
}

CDownloadRequest::~CDownloadRequest(void)
{
}
