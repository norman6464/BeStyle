<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.1-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/AWS-ECS%20%7C%20Cognito-FF9900?style=flat-square&logo=amazonaws&logoColor=white" alt="AWS">
  <img src="https://img.shields.io/badge/Docker-24-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
</p>

# BeStyle

**SNS Application - Microservices Architecture**

Technical Design Document | Version 1.0

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [アーキテクチャ設計背景](#2-アーキテクチャ設計背景)
3. [システム構成](#3-システム構成)
4. [技術スタック](#4-技術スタック)
5. [サービス詳細](#5-サービス詳細)
6. [開発環境構成](#6-開発環境構成)
7. [今後のロードマップ](#7-今後のロードマップ)

---

## 1. プロジェクト概要

### 1.1 BeStyleとは

BeStyleは、マイクロサービスアーキテクチャを採用したSNS（ソーシャル・ネットワーキング・サービス）アプリケーションです。スケーラビリティと保守性を重視しながらも、開発初期段階では複雑性を抑えた現実的なアプローチを採用しています。

### 1.2 主要機能

MVPとして以下の4つのコア機能を実装しています：

- **ユーザー認証・管理** - AWS Cognitoを活用したセキュアな認証基盤
- **投稿機能** - テキスト投稿、リプライ、いいね、ブックマーク
- **フォロー機能** - フォロー/フォロワー管理、非公開アカウント対応
- **タイムライン表示** - BFFでの集約・整形によるパーソナライズドフィード

---

## 2. アーキテクチャ設計背景

### 2.1 なぜマイクロサービスを選択したか

SNSアプリケーションの特性として、ユーザー管理、投稿、フォロー関係といった機能ドメインが明確に分離可能です。将来的なスケールアウトやチーム分割を見据え、初期段階からマイクロサービスアーキテクチャを採用することで、技術的負債の蓄積を防ぎます。

### 2.2 段階的アプローチの採用

本プロジェクトでは、複雑性を段階的に導入するアプローチを採用しています：

| フェーズ | 採用する技術 | 理由 |
|---------|-------------|------|
| **Phase 1（現在）** | 同期通信（REST API） | 開発・デバッグの容易さを優先 |
| **Phase 2** | 非同期通信（SQS）追加 | イベント駆動で疎結合化 |
| **Phase 3** | S3によるメディア管理 | 画像・動画投稿機能の追加 |

### 2.3 設計上の重要な決定事項

#### AWS Cognito の直接利用

認証基盤として AWS Cognito を採用しました。LocalStack でのエミュレーションは採用せず、開発段階から本番の Cognito を直接使用しています。これにより、**無料枠の範囲内でコストを抑えつつ**、本番環境との差異によるバグを防止しています。

#### LocalStack 不採用の理由

S3・SQS については LocalStack でのエミュレーションを当初検討しましたが、Phase 1 では不採用としました：

- **S3** - 画像アップロード機能は将来フェーズで実装予定
- **SQS** - 同期通信で開始し、必要に応じて非同期化を検討

---

## 3. システム構成

### 3.1 アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Frontend (SPA)                        │
│                       localhost:3000                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │ REST API
┌─────────────────────────────▼───────────────────────────────────┐
│                    BFF Service (認証・集約)                      │
│                       localhost:8080                            │
└──────────┬──────────────────┬───────────────────┬───────────────┘
           │ Feign            │ Feign             │ Feign
┌──────────▼──────┐  ┌────────▼────────┐  ┌──────▼──────────┐
│  User Service   │  │  Post Service   │  │ Follow Service  │
│  localhost:8081 │  │  localhost:8082 │  │ localhost:8083  │
└────────┬────────┘  └────────┬────────┘  └───────┬─────────┘
         │                    │                   │
         ▼                    ▼                   ▼
   [MySQL:8889]          [MySQL:8889]        [MySQL:8889]
```

### 3.2 サービス構成

| サービス | ポート | 責務 |
|---------|--------|------|
| **BFF** | 8080 | 認証・認可、タイムライン集約、レスポンス整形 |
| **User Service** | 8081 | ユーザー登録・プロフィール管理・設定・ブロック |
| **Post Service** | 8082 | 投稿CRUD・いいね・ブックマーク・ハッシュタグ |
| **Follow Service** | 8083 | フォロー関係管理・フォローリクエスト |

---

## 4. 技術スタック

### 4.1 バックエンド

| 技術 | バージョン / 詳細 |
|------|------------------|
| Java | 21 (LTS) |
| Spring Boot | 4.0.1 |
| ビルドツール | Gradle 8.14.3 |
| データベース | MySQL 8.0 (utf8mb4) |
| キャッシュ | Redis（セッション・APIキャッシュ） |
| サービス間通信 | Spring Cloud OpenFeign |

### 4.2 フロントエンド

| 技術 | 用途 |
|------|------|
| React 18 | UIライブラリ |
| Redux Toolkit | 状態管理 |
| React Router | ルーティング |
| Axios | HTTP通信 |
| Tailwind CSS | スタイリング |

### 4.3 インフラストラクチャ（本番環境）

| AWSサービス | 用途 |
|------------|------|
| Amazon ECS (Fargate) | コンテナオーケストレーション |
| Amazon RDS | マネージドMySQL |
| Amazon ElastiCache | マネージドRedis |
| Amazon Cognito | 認証・JWT発行 |
| ALB | ロードバランサー |
| Amazon ECR | コンテナレジストリ |
| CloudWatch | 監視・ログ収集 |

---

## 5. サービス詳細

### 5.1 BFF Service

BFF（Backend for Frontend）はフロントエンドとバックエンドの間に位置し、以下の責務を担います：

- **認証・認可** - AWS Cognitoと連携したJWT検証
- **CORS設定** - フロントエンドからのクロスオリジンリクエスト許可
- **タイムライン集約** - 複数サービスからデータを収集・整形
- **レスポンス整形** - フロントエンド用にデータを最適化

#### 主要な依存関係（BFFのみ）

- spring-boot-starter-security
- spring-boot-starter-security-oauth2-client
- spring-boot-starter-webflux（非同期HTTP通信用）
- spring-cloud-starter-openfeign

### 5.2 User Service

ユーザー情報の管理を担当するサービスです。

#### 主要テーブル

- **users** - ユーザー基本情報
- **user_stats** - フォロワー数・投稿数などの統計
- **user_settings** - プライバシー設定
- **user_blocks** - ブロック関係
- **user_mutes** - ミュート関係

### 5.3 Post Service

投稿コンテンツの管理を担当するサービスです。

#### 主要テーブル

- **posts** - 投稿本体（リプライ・リポスト・引用も含む）
- **post_stats** - いいね数・リプライ数などの統計
- **post_likes** - いいね関係
- **post_bookmarks** - ブックマーク
- **hashtags** - ハッシュタグマスター

### 5.4 Follow Service

フォロー関係の管理を担当するサービスです。

#### 主要テーブル

- **follows** - フォロー関係
- **follow_requests** - 非公開アカウントへのフォローリクエスト
- **follow_history** - フォロー履歴（監査用）

---

## 6. 開発環境構成

### 6.1 ハイブリッド構成

開発環境では、**Spring BootアプリケーションはDocker化**しつつ、**データベースとRedisはローカルインストール**という構成を採用しています。

| コンポーネント | 実行環境 | 接続先 |
|--------------|---------|--------|
| Spring Boot | Docker (Gradle 8.14.3) | host.docker.internal |
| MySQL | MAMP (ローカル) | localhost:8889 |
| Redis | Redis for Mac (ローカル) | localhost:6379 |
| Cognito | AWS 本番（無料枠） | ap-northeast-1 |

### 6.2 データベース設定

MySQL接続設定（application.properties）:

```properties
spring.datasource.url=jdbc:mysql://localhost:8889/fre_style
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

---

## 7. 今後のロードマップ

### 7.1 Phase 2: 非同期通信の導入

- Amazon SQS によるイベント駆動アーキテクチャ
- サービス間の疎結合化
- 通知サービスの追加

### 7.2 Phase 3: メディア機能

- Amazon S3 による画像・動画保存
- CloudFront によるCDN配信
- 画像リサイズ・最適化（Lambda）

### 7.3 Phase 4: 検索・レコメンド

- Elasticsearch による全文検索
- トレンドハッシュタグ算出
- おすすめユーザー・投稿のレコメンド

---

## お問い合わせ

ご質問やご提案がございましたら、お気軽にお問い合わせください。

---

*This document is confidential and intended for authorized recipients only.*
