#pragma once
#include "afxwin.h"

class CThogClientThread;

// CThogDlg dialog
class CThogDlg : public CDialogEx
{
// Construction
public:
	CThogDlg(CWnd* pParent = NULL);	// standard constructor
	~CThogDlg();	

// Dialog Data
	enum { IDD = IDD_MALCLIENT_DIALOG };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support

// Implementation

public:
	CThogClientThread* m_pClientThread;

protected:
	HICON m_hIcon;

	// Generated message map functions
	virtual BOOL OnInitDialog();
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:
	CString m_baseUrl;
	CString m_requestData;
	CString m_payloadData;

	void RecurseNode(const rapidjson::Value &node, CString name, int nLevel = 0);
	void CreateJSON(void);

	afx_msg void OnSend();
	afx_msg LRESULT OnMsgSent(WPARAM nColumn, LPARAM);
	afx_msg void OnDestroy();

	virtual void OnOK();

	int m_statusCode;
	CComboBox m_ctlMethodCombo;
	CComboBox m_ctlCmdCombo;
	afx_msg void OnChangeRequest();
};
