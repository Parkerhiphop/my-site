---
title: 我如何架設 WordPress 網站
date: '2025-04-13'
tags: ['軟體開發', 'WordPress', 'AWS']
draft: false
summary: 使用 AWS EC2 和 Easy Engine 快速部署 WordPress 網站，需要一點程式背景但很便宜！
---

去年在工作上有處理幾個大型的 WordPress 的網站，來記錄跟分享一下學到的 WordPress 架站策略。

這裡之後也會改成 WordPress，改完會再跟上來分享為什麼跟怎麼做的。

![WordPress Logo](https://s.w.org/style/images/about/WordPress-logotype-standard.png)

## WordPress.com vs WordPress.org

首先來帶一下官方的兩種方案。我身為工程師其實一直都只知道 [WordPress.org](https://wordpress.org/)，前陣子有朋友來問我才知道原來還有 [WordPress.com](https://wordpress.com/)。

WordPress.com 是由 Automattic 公司提供的全方位託管服務，在網頁上點一點就能建立網站。但相對地自由度極低，主題客製化困難，很多外掛不能用，免費版陽春到一定得付費。

WordPress.org 是可以下載開源的 WordPress 軟體。可以依照自己的需求部署，幾乎沒有任何限制——安裝外掛、修改主題，或進行各種神奇的客製化都很自由。但就是要自己管理伺服器、更新跟備份。

不過 WordPress.org 在市場上也有許多整合方案能簡化流程，也不是一定得要找工程師才能弄，而且我有預感用 WordPress.com 的人遲早也是得跳槽，因為限制真的太多又不便宜。

本篇也是使用 WordPress.org，是需要懂一點技術，但我會盡量把流程講清楚一點。

## WordPress.org 市面上的託管方案

這邊介紹的我都沒有用過，但可以分析一下價格和一些初步的觀察。

### 1. 傳統虛擬主機（如 [BlueHost](https://www.bluehost.com/)）

基本費用是每月 2.95 美金（新台幣 95/月），可以很快地把網站架起來，也可以直接在裡面額外去購買網站的域名。

但會遇到跟 WordPress.com 類似的問題，伺服器有狀況很難調整，有問題得直接找客服，也不是很好維護。

### 2. 雲端平台託管

#### AWS Lightsail

[官方教學](https://aws.amazon.com/tw/getting-started/hands-on/launch-a-wordpress-website/)

可以在 AWS 上面按一按就建立起來，基本方案是每月 3.5 美金（新台幣 113/月）。

我也是用 AWS，但我是自己建 EC2，下方會介紹。

#### Google Cloud Platform

[在 Google Cloud 中使用 WordPress](https://cloud.google.com/wordpress?hl=zh-TW)

GCP 一樣有提供 WordPress 部署的整合方案，但超貴，每個月 13.17 美金起 （新台幣 427/月），設定上也沒有 AWS Lightsail 容易。

## 我選擇的 Tech Stack

我後來採用 [AWS EC2](https://aws.amazon.com/tw/ec2/) 部署、[Easy Engine](https://easyengine.io/) 管理 和 [Cloudflare](https://www.cloudflare.com/zh-tw/) 註冊網域跟 DNS。

EasyEngine 可以直接下載，Cloudflare 也可以先用免費方案，AWS EC2 基本上是使用免費方案，但硬碟容量需要付費把 EC2 關聯的 EBS 升級到 16 GiB，所以會有一筆每月 1.28 美金（約 新台幣 41/月）的費用。

根據 [AWS EBS 的計算方式](https://aws.amazon.com/ebs/pricing/)，對於一個 16 GiB 的 gp3 磁碟：

- 儲存費用：$0.08/GB-月 × 16 GB = $1.28/月
- IOPS 費用：$0（使用內含的 3,000 IOPS）
- 吞吐量費用：$0（使用內含的 125 MB/s）
  總計每月成本：$1.28（美金）

雖然要自己弄自己管，但費用就是可以直接省下來，這種網站架設的伺服器費用、管理費就相當於租金跟大樓管理費，每個月的費用當然能低就低。

## 架設步驟

### 1. 建立 AWS EC2 實例

登入 AWS 後，進入到 EC2 的頁面，建立一個 EC2 實例（Instance）

![AWS EC2 實例建立頁面](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.03.53@2x-1024x423.png)

#### 1-1. 選擇 Ubuntu 作為作業系統

![選擇 Ubuntu 作業系統](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.04.51@2x-1024x660.png)

#### 1-2. 在 Key Pair 的地方建立或選擇 Key Pair

![建立 Key Pair](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.05.17@2x-1024x179.png)

建立的話會產生一個金鑰檔案 `$ssh_key.pem` 可以下載

要在本地執行 ssh 上去時會需要使用到它。

#### 1-3. Network 設定

在 EC2 的 security group 中開啟 SSH、HTTP（80）和 HTTPS（443）的 port，圖下那三個 Allow 按鈕。

![EC2 安全群組設定，顯示開啟 SSH、HTTP 和 HTTPS 端口](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.07.33@2x-1024x600.png)

#### 1-4. 調整硬碟容量

因為待會要裝 EasyEngine，至少需要 5GB 的硬碟空間，所以需要升級成 16 GiB。

可以在 EC2 建立頁面的這個區塊設定：
![EC2 硬碟容量設定區塊](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.08.57@2x-1024x393.png)

如果像我一樣是先選 8GiB 遇到：`EasyEngine update requires minimum 5GB disk space to run`，可以在 EC2 的 Dashboard 中找到對應的當前實體對應的 Volume，再去按 modify 就可以。

![EC2 Volume 修改頁面](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-16.53.53@2x-2048x601.png)

升級完後要 SSH 進去 EC2 的 ubuntu 跑這個指令 `sudo resize2fs /dev/xvda1`（可以再跑 `df -h` 檢查容量）。

### 2. 安裝 Easy Engine 跟 WordPress

[EasyEngine](https://easyengine.io/) 的副標題就是 Easy WordPress on Nginx，顧名思義提供基於 Docker 的 WordPress 環境，並使用 nginx 作為 Web Server。

先在 EC2 Instance 的頁面找到 Connect：

![EC2 實例連接頁面](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.33.54@2x-1024x484.png)

點進去後直接複製下面那一行，但是要記得在自己存放 ssh key pem 的地方執行這個指令。

![SSH 連接指令](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.31.57@2x-1024x362.png)

像是我的 pem 存在一個 ssh 資料夾底下，打開 terminal 輸入指令後連進去後就會像這樣：

![成功連接到 EC2 的終端機](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.39.08@2x-1024x808.png)

下方的指令就是按照 Easy Engine 官網指示的跑，但 `example.com` 那邊要換成自己有設定好 DNS 的網址。

```
# Install EasyEngine on Linux
wget -qO ee rt.cx/ee4 && sudo bash ee

# Install EasyEngine on Mac
brew install easyenginef

# Create a site at example.com with WordPress
sudo ee site create example.com --type=wp
```

看到這樣的畫面後 WordPress 就建立完成了！

![](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.40.53@2x-892x1024.png)

### 3. 註冊網域以及設定 DNS

我之前是用 GoDaddy 買網域，現在改用 [Cloudflare](https://www.cloudflare.com/zh-tw/) 比較好管理也比較便宜（我的網域在 GoDaddy 買要新台幣 1600/年，但轉去 Cloudflare 只要新台幣 900/年）。

先登入 Cloudflare 後台就可以開始找想要買的網域。

![](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.45.37@2x-1024x772.png)

再來到帳戶首頁就會出現剛註冊好的網域

![](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.49.00@2x-1024x524.png)

最後把剛剛在 EC2 Connect 那一頁也有的 Public IP 貼過來設定一個 A Record 就好了。

名稱用 `@` 代表針對整個網域使用，寫字串的話就可以導到子網域。

假設網域名是 your-domain.com ，A record 可以這樣設定：

- `@` ：指示 ec2_ip 連到 your-domain.com

- test：指示 ec2_ip 連到 test.your-domain.com

![](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.50.22@2x-1024x602.png)

## 快速複習架設流程

1. 在 Cloudflare 註冊一個網域（例如：your-domain.com）

2. 建立 EC2 實例：
   - 使用 Ubuntu 系統
   - 確保有 16GiB 儲存空間
   - 開啟 HTTP 和 HTTPS port 和設定 SSH key pair
3. 透過 SSH 連接到 EC2，安裝 Easy Engine

4. 使用 `ee site create your-domain.com --wp` 建立 WordPress 網站

5. 在 Cloudflare DNS 將網域指向 EC2 的公開 IP（設定 A Record）

6. 完成！現在可以直接連上 your-domain.com 和 your-domain.com/wp-admin

## 結語

我自己覺得這套 WordPress 的部署組合挺好用的，大流量也可以透過各方面的調整來扛住。

升級硬碟等伺服器管理在 EC2，WordPress 的管理可以用 easy engine CLI，網域相關的管理可以透過 Cloudflare。

流量上來之後，可以把 Cloudflare 的 Cache 開起來，再來也可以把 easy engine 裡面的 nginx cache 開起來，可以逐步升級服務。

這篇只提到了 WordPress 的架設，但成功架起來後還得調整 WordPress 主題跟裝各種外掛，之後有空再來分享了。

### murmur

睽違一年半來寫技術文章，挺累的，但又覺得很多日常的筆記卡在記事本有點可惜，還是整理整理慢慢丟上來好了。

這次寫 WordPress，我一直游移在要寫給一般人還是工程師，因為剛好有非工程師的朋友來問我怎麼架，要解釋到哪裡真的很苦惱，這篇文章感覺對工程師有點解釋太多，但對一般人可能看完也會很模糊，但後來還是選擇先把它當筆記來寫，把我怎麼做的過程記錄下來就好。

另外是 AI 出來後我也挺苦惱技術部落格的意義，但我目前這套作法怎麼問 AI 都問不太出來，也沒看到很多人在介紹，所以覺得可以來寫一下。
