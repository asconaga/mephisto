#pragma once


// CJsonRapidDlg dialog
class CJsonRapidDlg : public CDialogEx
{
// Construction
public:
	CJsonRapidDlg(CWnd* pParent = nullptr);	// standard constructor

// Dialog Data
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_JSONRAPID_DIALOG };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support

	void RecurseNode(const rapidjson::Value &node, CString name, int nLevel = 0);

// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	virtual BOOL OnInitDialog();
	afx_msg void OnPaint();
	afx_msg void OnCreateJSON(void);
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:
	CString m_szOutput;
};
